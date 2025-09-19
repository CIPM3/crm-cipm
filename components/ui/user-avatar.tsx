"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { UsersType } from "@/types"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user?: UsersType | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  alt?: string
  fallbackClassName?: string
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm", 
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg"
}

export function UserAvatar({ 
  user: providedUser, 
  size = "md", 
  className, 
  alt,
  fallbackClassName 
}: UserAvatarProps) {
  const { user: currentUser } = useAuthStore()
  
  // Use provided user or fall back to current authenticated user
  const user = providedUser || currentUser
  
  if (!user) {
    return (
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarFallback className={fallbackClassName}>
          ?
        </AvatarFallback>
      </Avatar>
    )
  }

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return "U"
    const cleanName = name.trim()
    const words = cleanName.split(/\s+/).filter(word => word.length > 0)
    
    if (words.length === 0) return "U"
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  // Construct avatar URL - prefer user.avatar, then fallback
  const avatarUrl = user.avatar && user.avatar.trim() !== '' ? user.avatar.trim() : ''
  const initials = getInitials(user.name || user.email || "Usuario")

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={alt || user.name || "Usuario"} 
          className="object-cover"
        />
      )}
      <AvatarFallback className={cn("bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

// Hook for getting user avatar URL with fallback
export function useUserAvatar(user?: UsersType | null) {
  const { user: currentUser } = useAuthStore()
  const targetUser = user || currentUser
  
  return {
    avatarUrl: targetUser?.avatar || "",
    fallbackText: targetUser ? 
      targetUser.name?.charAt(0)?.toUpperCase() || 
      targetUser.email?.charAt(0)?.toUpperCase() || 
      "U" : "?",
    hasAvatar: !!(targetUser?.avatar)
  }
}