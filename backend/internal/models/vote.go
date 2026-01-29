package models

import "time"

// Vote model - tracks individual user votes on posts
type Vote struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	UserID    int       `json:"user_id"`
	PostID    int       `json:"post_id"`
	VoteType  int       `json:"vote_type"` // 1 for upvote, -1 for downvote
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
