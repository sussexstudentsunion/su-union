import getFalmerEndpoint from '~libs/getFalmerEndpoint';
import { parseTickets } from '~libs/mslEventTicketParser';
import user from "~libs/user";

const pathRegEx = /^\/ents\/event\/([0-9]+)\/?/;

function eventPage() {

  const match = window.location.pathname.match(pathRegEx);

  if (match !== null) {
    if (window.location.hash === '#tickets') {
      return;
    }

    if (window.self !== window.top) {
      window.top.postMessage(
        {
          source: 'ussu-msl-frame-initial-data',
          payload: {
            tickets: parseTickets(),
            pageMenuOptions: user ? user.auth.page : false,
          },
        },
        '*',
      );

      return;
    }

    try {
      const mslEventId = parseInt(match[1], 10);

      fetch(`${getFalmerEndpoint()}/graphql/`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          query FalmerEventPath($mslEventId: Int) {
            event(mslEventId: $mslEventId) {
              slug
              eventId
            }
          }
        `,
          variables: {
            mslEventId,
          },
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.data.event) {
            const { slug, eventId } = response.data.event;
            window.history.replaceState({}, '', `/whats-on/${slug}-${eventId}`);
            window.location.reload();
          }
        });
    } catch (e) {
      // do nothing
    }
  }
}

eventPage();
