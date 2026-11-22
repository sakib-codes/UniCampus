import React from "react";
import { Avatar, type AvatarSize } from "@/components/ui";

export interface ProfileAvatarProps {
  className?: string;
  iconClassName?: string;
  size?: AvatarSize;
  alt?: string;
  src?: string | null;
}

export default function ProfileAvatar({
  className = "",
  iconClassName = "",
  size,
  alt = "",
  src,
}: ProfileAvatarProps) {
  return (
    <Avatar
      alt={alt}
      size={size}
      src={src}
      className={className}
      iconClassName={iconClassName}
    />
  );
}
