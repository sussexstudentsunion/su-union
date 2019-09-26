import React, { useCallback } from 'react';
import HeartFull from '../../../icons/heart-full.svg';
import Heart from '../../../icons/heart-empty.svg';
import { Event } from '@ussu/common/src/types/events';
import LikeEvent from './LikeEvent.graphql';
import { useMutation } from '@apollo/react-hooks';
import { useViewer } from '../../bookmarket/currentUserData';
import { useDispatch } from 'redux-react-hook';
import { openLoginModal } from '../../../ducks/user';

export const EventLikeButton: React.FC<{ event: Event }> = ({ event }) => {
  const { loading, isAuthenticated } = useViewer();
  const [likeEvent] = useMutation(LikeEvent);
  const dispatch = useDispatch();

  const handleLike = useCallback(() => {
    if (isAuthenticated) {
      likeEvent({
        variables: {
          eventId: event.eventId,
          type:
            event.userLike === null || event.userLike.source === 'UNLIKED'
              ? 'USER'
              : 'UNLIKED',
        },
      });
    } else {
      console.log(isAuthenticated, openLoginModal());
      dispatch(openLoginModal());
    }
  }, [loading, isAuthenticated, likeEvent, event.userLike]);

  const isLiked = event.userLike && event.userLike.source === 'USER';

  if (loading || true) {
    return null;
  }

  return (
    <button
      css={{
        background: 'transparent',
        border: 0,
        outline: 0,
        width: '100%',
        height: '100%',
        padding: 8,
        color: isLiked ? '#ff62c4' : '#fff',
        '&:hover': {
          '& svg': {
            transform: 'scale(1.2)',
          },
        },

        '& svg': {
          zIndex: 5,
          position: 'relative',
          transition: 'transform 300ms ease',

          transform: 'scale(1.0)',
        },
      }}
      type="button"
      aria-label="Like"
      onClick={handleLike}
    >
      {isLiked ? <HeartFull /> : <Heart />}
    </button>
  );
};
