package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// User model
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

// Post model
type Post struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	Content   string    `json:"content"`
	Image     string    `json:"image"`
	UserID    uint      `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Upvotes   int       `gorm:"default:0" json:"upvotes"`
	Downvotes int       `gorm:"default:0" json:"downvotes"`
	CreatedAt time.Time `json:"created_at"`
}

// Comment model
type Comment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `gorm:"not null" json:"content"`
	PostID    uint      `json:"post_id"`
	UserID    uint      `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt time.Time `json:"created_at"`
}

// Follow model
type Follow struct {
	ID          uint `gorm:"primaryKey" json:"id"`
	FollowerID  uint `json:"follower_id"`
	FollowingID uint `json:"following_id"`
	Follower    User `gorm:"foreignKey:FollowerID" json:"follower"`
	Following   User `gorm:"foreignKey:FollowingID" json:"following"`
}

var db *gorm.DB

func main() {
	// Initialize database
	var err error
	db, err = gorm.Open(sqlite.Open("reddit.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}
	fmt.Println("✅ Database connected successfully")

	// Auto migrate schemas
	err = db.AutoMigrate(&User{}, &Post{}, &Comment{}, &Follow{})
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}
	fmt.Println("✅ Database migrations completed")

	// Initialize Gin router
	r := gin.Default()

	// Apply CORS middleware
	r.Use(corsMiddleware())

	// Public routes
	r.POST("/api/register", registerHandler)
	r.POST("/api/login", loginHandler)
	r.GET("/api/posts", getPostsHandler)

	// Protected routes
	protected := r.Group("/api")
	protected.Use(authMiddleware())
	{
		protected.POST("/posts", createPostHandler)
		protected.POST("/posts/:id/vote", voteHandler)
		protected.POST("/posts/:id/comments", createCommentHandler)
		protected.PUT("/posts/:id", updatePostHandler)
		protected.DELETE("/posts/:id", deletePostHandler)
		protected.PUT("/users/:id", updateUserProfileHandler)
		protected.POST("/users/:id/follow", followUserHandler)
		protected.DELETE("/users/:id/follow", unfollowUserHandler)
	}

	// Comment routes
	r.GET("/api/posts/:id/comments", getCommentsHandler)

	// Profile routes
	r.GET("/api/users/:id", getUserProfileHandler)
	r.GET("/api/users/:id/followers", getFollowersHandler)
	r.GET("/api/users/:id/following", getFollowingHandler)

	// Start server
	fmt.Println("🚀 Server starting on http://localhost:8080")
	fmt.Println("📝 Press Ctrl+C to stop the server")
	r.Run(":8080")
}

// CORS Middleware
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// Auth Middleware (simplified - in production use JWT)
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// In production, validate JWT token here
		// For now, we'll just check if token exists
		c.Set("user_id", uint(1)) // Mock user ID
		c.Next()
	}
}

// Register Handler
func registerHandler(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, hash the password
	user := User{
		Username: input.Username,
		Email:    input.Email,
		Password: input.Password, // Should be hashed
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username or email already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user":    user,
	})
}

// Login Handler
func loginHandler(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.Where("email = ? AND password = ?", input.Email, input.Password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// In production, generate JWT token here
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   "mock-jwt-token", // Replace with real JWT
		"user":    user,
	})
}

// Get Posts Handler
func getPostsHandler(c *gin.Context) {
	var posts []Post

	if err := db.Preload("User").Order("created_at desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// Create Post Handler
func createPostHandler(c *gin.Context) {
	var input struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content"`
		Image   string `json:"image"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")

	post := Post{
		Title:   input.Title,
		Content: input.Content,
		Image:   input.Image,
		UserID:  userID.(uint),
	}

	if err := db.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	// Load user data
	db.Preload("User").First(&post, post.ID)

	c.JSON(http.StatusCreated, post)
}

// Vote Handler
func voteHandler(c *gin.Context) {
	var input struct {
		VoteType string `json:"vote_type" binding:"required,oneof=upvote downvote"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	postID := c.Param("id")
	var post Post

	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if input.VoteType == "upvote" {
		post.Upvotes++
	} else {
		post.Downvotes++
	}

	db.Save(&post)

	c.JSON(http.StatusOK, post)
}

// Get Comments Handler
func getCommentsHandler(c *gin.Context) {
	postID := c.Param("id")
	var comments []Comment

	if err := db.Where("post_id = ?", postID).Preload("User").Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// Create Comment Handler
func createCommentHandler(c *gin.Context) {
	var input struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	postID := c.Param("id")
	userID, _ := c.Get("user_id")

	postIDUint, err := strconv.ParseUint(postID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	comment := Comment{
		Content: input.Content,
		PostID:  uint(postIDUint),
		UserID:  userID.(uint),
	}

	if err := db.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	db.Preload("User").First(&comment, comment.ID)
	c.JSON(http.StatusCreated, comment)
}

// Get User Profile Handler
func getUserProfileHandler(c *gin.Context) {
	userID := c.Param("id")
	var user User

	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Get user's posts
	var posts []Post
	db.Where("user_id = ?", userID).Preload("User").Order("created_at desc").Find(&posts)

	// Get follower/following counts
	var followerCount, followingCount int64
	db.Model(&Follow{}).Where("following_id = ?", userID).Count(&followerCount)
	db.Model(&Follow{}).Where("follower_id = ?", userID).Count(&followingCount)

	c.JSON(http.StatusOK, gin.H{
		"user":            user,
		"posts":           posts,
		"follower_count":  followerCount,
		"following_count": followingCount,
	})
}

// Update User Profile Handler
func updateUserProfileHandler(c *gin.Context) {
	userID := c.Param("id")
	var input struct {
		Username string `json:"username"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Username = input.Username
	db.Save(&user)

	c.JSON(http.StatusOK, user)
}

// Follow User Handler
func followUserHandler(c *gin.Context) {
	followingID := c.Param("id")
	followerID, _ := c.Get("user_id")

	followingIDUint, err := strconv.ParseUint(followingID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	follow := Follow{
		FollowerID:  followerID.(uint),
		FollowingID: uint(followingIDUint),
	}

	if err := db.Create(&follow).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already following or invalid user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully followed user"})
}

// Unfollow User Handler
func unfollowUserHandler(c *gin.Context) {
	followingID := c.Param("id")
	followerID, _ := c.Get("user_id")

	if err := db.Where("follower_id = ? AND following_id = ?", followerID, followingID).Delete(&Follow{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully unfollowed user"})
}

// Get Followers Handler
func getFollowersHandler(c *gin.Context) {
	userID := c.Param("id")
	var follows []Follow

	db.Where("following_id = ?", userID).Preload("Follower").Find(&follows)

	var followers []User
	for _, follow := range follows {
		followers = append(followers, follow.Follower)
	}

	c.JSON(http.StatusOK, followers)
}

// Get Following Handler
func getFollowingHandler(c *gin.Context) {
	userID := c.Param("id")
	var follows []Follow

	db.Where("follower_id = ?", userID).Preload("Following").Find(&follows)

	var following []User
	for _, follow := range follows {
		following = append(following, follow.Following)
	}

	c.JSON(http.StatusOK, following)
}

// Update Post Handler
func updatePostHandler(c *gin.Context) {
	postID := c.Param("id")
	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var post Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	post.Title = input.Title
	post.Content = input.Content
	db.Save(&post)

	c.JSON(http.StatusOK, post)
}

// Delete Post Handler
func deletePostHandler(c *gin.Context) {
	postID := c.Param("id")

	if err := db.Delete(&Post{}, postID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}
