import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListPlus, MoreHorizontal } from "lucide-react";

export const SongOptionsDropdown = ({
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onAddToLiked,
  onGoToAlbum,
  onShare,
}: {
  onAddToPlaylist?: () => void;
  onRemoveFromPlaylist?: () => void;
  onAddToLiked?: () => void;
  onGoToAlbum?: () => void;
  onShare?: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()} // Prevents song play on click
          variant="ghost"
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onAddToPlaylist?.();
        }}>
          <ListPlus className="mr-2 h-4 w-4" />
          Add to Playlist
        </DropdownMenuItem>

        {onRemoveFromPlaylist && (
            <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onRemoveFromPlaylist?.();
            }}>
            Remove from Playlist
            </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onAddToLiked?.();
        }}>
          Add to Liked Songs
        </DropdownMenuItem>

        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onGoToAlbum?.();
        }}>
          Go to Album
        </DropdownMenuItem>

        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onShare?.();
        }}>
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
