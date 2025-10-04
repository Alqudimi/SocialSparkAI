import tweepy
import requests
from typing import Dict, List, Optional
from .config import settings


class XTwitterIntegration:
    """Integration for posting to X/Twitter"""
    
    def __init__(self):
        # Validate credentials before initializing client
        if not all([settings.x_api_key, settings.x_api_secret, 
                   settings.x_access_token, settings.x_access_token_secret]):
            self.client = None
            self.credentials_missing = True
        else:
            try:
                self.client = tweepy.Client(
                    bearer_token=settings.x_bearer_token if settings.x_bearer_token else None,
                    consumer_key=settings.x_api_key,
                    consumer_secret=settings.x_api_secret,
                    access_token=settings.x_access_token,
                    access_token_secret=settings.x_access_token_secret
                )
                self.credentials_missing = False
            except Exception as e:
                self.client = None
                self.credentials_missing = True
                self.init_error = str(e)
    
    def post_tweet(self, content: str) -> Dict:
        """Post a tweet to X/Twitter"""
        if self.credentials_missing or not self.client:
            return {
                "success": False,
                "platform": "X/Twitter",
                "error": "Missing or invalid X/Twitter API credentials",
                "message": "X/Twitter credentials are not properly configured. Please add them to Replit Secrets."
            }
        
        try:
            response = self.client.create_tweet(text=content)
            return {
                "success": True,
                "platform": "X/Twitter",
                "post_id": response.data['id'] if response.data else None,
                "message": "Successfully posted to X/Twitter"
            }
        except Exception as e:
            return {
                "success": False,
                "platform": "X/Twitter",
                "error": str(e),
                "message": f"Failed to post to X/Twitter: {str(e)}"
            }


class ThreadsIntegration:
    """Integration for posting to Threads (Meta)"""
    
    def __init__(self):
        self.app_id = settings.threads_app_id
        self.app_secret = settings.threads_app_secret
        self.base_url = "https://graph.threads.net/v1.0"
    
    def post_thread(self, content: str, user_access_token: Optional[str] = None) -> Dict:
        """Post to Threads"""
        try:
            if not user_access_token:
                return {
                    "success": False,
                    "platform": "Threads",
                    "error": "User access token required",
                    "message": "Threads requires user-specific access token. Please connect your Threads account."
                }
            
            url = f"{self.base_url}/me/threads"
            payload = {
                "text": content,
                "access_token": user_access_token
            }
            
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "platform": "Threads",
                    "post_id": response.json().get("id"),
                    "message": "Successfully posted to Threads"
                }
            else:
                return {
                    "success": False,
                    "platform": "Threads",
                    "error": response.text,
                    "message": f"Failed to post to Threads: {response.text}"
                }
        except Exception as e:
            return {
                "success": False,
                "platform": "Threads",
                "error": str(e),
                "message": f"Failed to post to Threads: {str(e)}"
            }


class InstagramIntegration:
    """Integration for posting to Instagram (Meta)"""
    
    def __init__(self):
        self.app_id = settings.instagram_app_id
        self.app_secret = settings.instagram_app_secret
        self.base_url = "https://graph.instagram.com/v18.0"
    
    def post_to_instagram(self, content: str, image_url: Optional[str] = None, user_access_token: Optional[str] = None) -> Dict:
        """Post to Instagram using proper Media API flow"""
        try:
            if not user_access_token:
                return {
                    "success": False,
                    "platform": "Instagram",
                    "error": "User access token required",
                    "message": "Instagram requires user-specific access token. Please connect your Instagram account."
                }
            
            if not image_url:
                return {
                    "success": False,
                    "platform": "Instagram",
                    "error": "Image required",
                    "message": "Instagram posts require an image URL"
                }
            
            # Step 1: Create media container
            container_url = f"{self.base_url}/me/media"
            container_payload = {
                "image_url": image_url,
                "caption": content,
                "access_token": user_access_token
            }
            
            container_response = requests.post(container_url, data=container_payload)
            
            if container_response.status_code != 200:
                return {
                    "success": False,
                    "platform": "Instagram",
                    "error": container_response.text,
                    "message": f"Failed to create Instagram media container: {container_response.text}"
                }
            
            container_id = container_response.json().get("id")
            
            # Step 2: Publish the media container
            publish_url = f"{self.base_url}/me/media_publish"
            publish_payload = {
                "creation_id": container_id,
                "access_token": user_access_token
            }
            
            publish_response = requests.post(publish_url, data=publish_payload)
            
            if publish_response.status_code == 200:
                return {
                    "success": True,
                    "platform": "Instagram",
                    "post_id": publish_response.json().get("id"),
                    "message": "Successfully posted to Instagram"
                }
            else:
                return {
                    "success": False,
                    "platform": "Instagram",
                    "error": publish_response.text,
                    "message": f"Failed to publish Instagram media: {publish_response.text}"
                }
        except Exception as e:
            return {
                "success": False,
                "platform": "Instagram",
                "error": str(e),
                "message": f"Failed to post to Instagram: {str(e)}"
            }


class SocialMediaPublisher:
    """Main class to publish to multiple social media platforms"""
    
    def __init__(self):
        self.x_twitter = XTwitterIntegration()
        self.threads = ThreadsIntegration()
        self.instagram = InstagramIntegration()
    
    def publish_to_platforms(self, content: str, platforms: List[str], 
                            user_tokens: Optional[Dict[str, str]] = None,
                            image_url: Optional[str] = None) -> List[Dict]:
        """Publish content to multiple platforms"""
        results = []
        
        for platform in platforms:
            platform_lower = platform.lower()
            
            if platform_lower in ['x', 'twitter', 'x/twitter']:
                result = self.x_twitter.post_tweet(content)
                results.append(result)
            
            elif platform_lower in ['threads']:
                token = user_tokens.get('threads') if user_tokens else None
                result = self.threads.post_thread(content, token)
                results.append(result)
            
            elif platform_lower in ['instagram']:
                token = user_tokens.get('instagram') if user_tokens else None
                result = self.instagram.post_to_instagram(content, image_url, token)
                results.append(result)
            
            else:
                results.append({
                    "success": False,
                    "platform": platform,
                    "error": f"Unsupported platform: {platform}",
                    "message": f"Platform {platform} is not supported yet"
                })
        
        return results
