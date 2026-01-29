package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/emilythestrangee/reddit-clone/backend/internal/models"
)

type PostHandler struct {
	db *gorm.DB
}

func NewPostHandler(db *gorm.DB) *PostHandler {
	return &PostHandler{db: db}
}

// GetPosts returns all posts
func (h *PostHandler) GetPosts(c *gin.Context) {
	var posts []models.Post

	if err := h.db.Preload("User").Order("created_at desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// GetPost returns a single post by ID
func (h *PostHandler) GetPost(c *gin.Context) {
	postID := c.Param("id")
	var post models.Post

	if err := h.db.Preload("User").First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

// CreatePost creates a new post
func (h *PostHandler) CreatePost(c *gin.Context) {
	var input struct {
		Title string `json:"title" binding:"required"`
		Body  string `json:"body"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")

	post := models.Post{
		Title:    input.Title,
		Body:     input.Body,
		AuthorID: userID.(int),
	}

	if err := h.db.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	h.db.Preload("User").First(&post, post.ID)
	c.JSON(http.StatusCreated, post)
}

// UpdatePost updates an existing post
func (h *PostHandler) UpdatePost(c *gin.Context) {
	postID := c.Param("id")
	userID, _ := c.Get("user_id")

	var input struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var post models.Post
	if err := h.db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check if user owns the post
	if post.AuthorID != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit your own posts"})
		return
	}

	if input.Title != "" {
		post.Title = input.Title
	}
	if input.Body != "" {
		post.Body = input.Body
	}

	h.db.Save(&post)
	c.JSON(http.StatusOK, post)
}

// DeletePost deletes a post
func (h *PostHandler) DeletePost(c *gin.Context) {
	postID := c.Param("id")
	userID, _ := c.Get("user_id")

	var post models.Post
	if err := h.db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check if user owns the post
	if post.AuthorID != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own posts"})
		return
	}

	if err := h.db.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

// VotePost handles upvoting/downvoting a post
func (h *PostHandler) VotePost(c *gin.Context) {
	postID := c.Param("id")
	userID, _ := c.Get("user_id")

	var input struct {
		VoteType int `json:"vote_type" binding:"required,oneof=-1 1"` // -1 for downvote, 1 for upvote
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vote type must be -1 or 1"})
		return
	}

	// Check if post exists
	var post models.Post
	if err := h.db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check if user already voted
	var existingVote models.Vote
	err := h.db.Where("user_id = ? AND post_id = ?", userID, postID).First(&existingVote).Error

	if err == nil {
		// User already voted - update the vote
		if existingVote.VoteType == input.VoteType {
			// Same vote - remove it (toggle)
			h.db.Delete(&existingVote)
			c.JSON(http.StatusOK, gin.H{"message": "Vote removed"})
			return
		} else {
			// Different vote - update it
			existingVote.VoteType = input.VoteType
			h.db.Save(&existingVote)
			c.JSON(http.StatusOK, gin.H{"message": "Vote updated"})
			return
		}
	}

	// Create new vote
	vote := models.Vote{
		UserID:   userID.(int),
		PostID:   post.ID,
		VoteType: input.VoteType,
	}

	if err := h.db.Create(&vote).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to vote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vote recorded"})
}
