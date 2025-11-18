import type { RedditData, Post, Comment, PostWithComments } from '../types';

// Helper to extract relevant post data from Reddit API response
const mapRedditPost = (apiPost: any): Post => {
    const postData = apiPost.data;
    return {
        id: postData.id,
        title: postData.title,
        selftext: postData.selftext,
        author: postData.author,
        createdAt: postData.created_utc,
    };
};

// Helper to extract relevant comment data
const mapRedditComment = (apiComment: any): Comment => {
    const commentData = apiComment.data;
    return {
        id: commentData.id,
        body: commentData.body,
        author: commentData.author,
    };
};

export const fetchSubredditData = async (subredditName: string): Promise<RedditData> => {
    console.log(`Fetching real data for r/${subredditName}...`);

    try {
        const categories = ['new', 'top', 'controversial'];
        const postPromises = categories.map(category =>
            fetch(`https://www.reddit.com/r/${subredditName}/${category}.json?limit=5`)
                .then(res => {
                    if (res.status === 429) {
                        throw new Error('Reddit API rate limit exceeded. Please try again in a few moments.');
                    }
                    if (res.status === 404) {
                        throw new Error(`Subreddit r/${subredditName} not found. It may be private, banned, or spelled incorrectly.`);
                    }
                    if (!res.ok) {
                        throw new Error(`Failed to fetch ${category} posts for r/${subredditName} (status: ${res.status})`);
                    }
                    return res.json();
                })
        );

        const postResults = await Promise.all(postPromises);

        const uniquePosts = new Map<string, Post>();
        postResults.forEach(result => {
            result?.data?.children?.forEach((post: any) => {
                if (post.data && !uniquePosts.has(post.data.id)) {
                    uniquePosts.set(post.data.id, mapRedditPost(post));
                }
            });
        });

        const allPosts = Array.from(uniquePosts.values());
        
        if (allPosts.length === 0) {
            throw new Error(`No posts found for r/${subredditName}. The subreddit may not exist or is empty.`);
        }

        const postsWithComments: PostWithComments[] = await Promise.all(
            allPosts.map(async (post) => {
                try {
                    const commentsRes = await fetch(`https://www.reddit.com/r/${subredditName}/comments/${post.id}.json?limit=5`);
                    if (!commentsRes.ok) {
                        // Don't throw here, just return empty comments for this post
                        console.warn(`Failed to fetch comments for post ${post.id} (status: ${commentsRes.status})`);
                        return { ...post, comments: [] };
                    }
                    const commentsData = await commentsRes.json();
                    
                    const commentListings = commentsData[1]?.data?.children || [];

                    const comments = commentListings
                        .filter((comment: any) => comment.kind === 't1' && comment.data.body && comment.data.author !== '[deleted]')
                        .map(mapRedditComment)
                        .slice(0, 5);

                    return { ...post, comments };
                } catch (commentError) {
                    console.warn(`Error fetching comments for post ${post.id}:`, commentError);
                    return { ...post, comments: [] };
                }
            })
        );
        
        postsWithComments.sort(() => Math.random() - 0.5);

        const data: RedditData = {
            posts: postsWithComments,
        };

        console.log(`Successfully fetched and processed data for r/${subredditName}.`);
        return data;

    } catch (error) {
        console.error(`Error in fetchSubredditData for r/${subredditName}:`, error);
        if (error instanceof Error) {
            if (error.message === 'Failed to fetch') {
                throw new Error("This does not appear to be a valid public subreddit, please double check the name");
           }
            // Re-throw the specific error message from our fetch checks
            throw error;
        }
        throw new Error('An unknown error occurred while fetching data from Reddit.');
    }
};