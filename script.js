document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

// Function to load all posts
async function loadPosts() {
    const response = await fetch('php/post.php');
    const posts = await response.json();
    const postContainer = document.getElementById('post-container');
    
    // Clear previous posts
    postContainer.innerHTML = '';

    // Loop through each post and create the HTML structure
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <div class="comment-box">
                <input type="text" id="comment-input-${post.id}" placeholder="Add a comment...">
                <button onclick="addComment(${post.id})">Submit</button>
                <div id="comments-${post.id}"></div>
                <div class="reality-meter" id="reality-meter-${post.id}" style="background-color:#e63946; height: 10px; width: 0;"></div>
            </div>
        `;
        
        postContainer.appendChild(postElement);

        // Load comments and update the reality meter for each post
        loadComments(post.id);
    });
}

// Function to load comments for a post and update reality meter
async function loadComments(postId) {
    const response = await fetch(`php/comments.php?post_id=${postId}`);
    const data = await response.json();  // Fetch both comments and reality percentage
    const comments = data.comments;
    const realityPercentage = data.reality_percentage;

    const commentsContainer = document.getElementById(`comments-${postId}`);
    commentsContainer.innerHTML = ''; // Clear existing comments

    // Loop through each comment and add to the DOM
    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.innerText = comment.content;
        commentsContainer.appendChild(commentElement);
    });

    // Update the reality meter based on the percentage
    updateRealityMeter(postId, realityPercentage);
}

// Function to add a new comment
async function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentContent = commentInput.value.trim();  // Get the comment content

    if (!commentContent) return;  // Don't submit empty comments

    // Send comment to the server via POST
    await fetch(`php/comments.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, content: commentContent }),
    });

    commentInput.value = '';  // Clear the input field after submission

    // Reload comments and update the reality meter
    loadComments(postId);
}

// Function to update the reality meter visually
function updateRealityMeter(postId, realityPercentage) {
    const realityMeter = document.getElementById(`reality-meter-${postId}`);
    
    // Update the width of the reality meter based on the percentage
    realityMeter.style.width = realityPercentage + '%';

    // Optionally, you could change the color or add other styles
    if (realityPercentage > 70) {
        realityMeter.style.backgroundColor = '#4caf50';  // Green for high reality
    } else if (realityPercentage > 30) {
        realityMeter.style.backgroundColor = '#ffeb3b';  // Yellow for moderate reality
    } else {
        realityMeter.style.backgroundColor = '#f44336';  // Red for low reality
    }
}
