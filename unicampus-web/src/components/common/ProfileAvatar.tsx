import React from "react";
import { Avatar, type AvatarSize } from "@/components/ui";

export interface ProfileAvatarProps {
  className?: string;
  iconClassName?: string;
  size?: AvatarSize;
  alt?: string;
}

export default function ProfileAvatar({
  className = "",
  iconClassName = "",
  size,
  alt = "",
}: ProfileAvatarProps) {
  return (
    <Avatar
      alt={alt}
      size={size}
      className={className}
      iconClassName={iconClassName}
    />
  );
}
