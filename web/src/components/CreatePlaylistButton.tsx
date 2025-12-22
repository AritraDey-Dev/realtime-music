import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { CreatePlaylistModal } from './CreatePlaylistModal';

export const CreatePlaylistButton = () => {
  return (
    <CreatePlaylistModal>
      <Button
        className='bg-white mx-10 my-20 hover:bg-white/80 text-black rounded-full w-auto cursor-pointer'
      >
        <Plus className='h-4 w-4' />
        Create a Playlist
      </Button>
    </CreatePlaylistModal>
  );
}
