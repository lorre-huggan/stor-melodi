import styles from '../styles/styles.module.scss';
import HeadTag from '../components/Head';
import React, { useEffect } from 'react';
import {
  NEW_RELEASES_ENDPOINT,
  GET_ACCESS_TOKEN,
  ARTIST_ENDPOINT,
  FEATURED_PLAYLIST_ENDPOINT,
  RECOMMENDATIONS_ENDPOINT,
  GET_URL_RESPONSE_TOKEN,
  GET_USER_ENDPOINT,
  GET_USER_TOP_TRACKS,
  GET_USER_TOP_ARTIST,
  GET_USER_PLAYLISTS_ENDPOINT,
} from '../lib/spotify';
import axios from 'axios';
import SmallAlbumCard from '../components/Album/SmallAlbumCard';
import FeaturedAlbum from '../components/Album/FeaturedAlbum';
import { useAppStateValue } from '../context/AppProvider';
import { types } from '../reducers/appReducer';
import { motion } from 'framer-motion';
import ReactRotatingText from 'react-rotating-text';
import Image from 'next/image';
import vinylShop from '../public/images/vinylShop.jpg';

const animations = {
  headers: {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },
  headingImage: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, duration: 1, ease: 'easeOut' },
    },
  },
};

export default function Home({
  newReleases,
  featuredArtist1,
  playlists,
  featuredArtist2,
  popGenre,
  hipHopGenre,
  featuredArtist3,
  featuredArtist4,
}) {
  const [{ userToken, user, userPlaylists, userTopTracks }, dispatch] =
    useAppStateValue();

  useEffect(() => {
    const hash = GET_URL_RESPONSE_TOKEN();
    const _token = hash.access_token;
    window.location.hash = '';
    if (_token) {
      dispatch({
        type: types.SET_USER_TOKEN,
        userToken: _token,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (userToken) {
      axios
        .get(GET_USER_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          dispatch({
            type: types.SET_USER,
            user: res.data,
          })
        )

        .catch((err) => console.log(err));
    }
    return;
  }, [userToken, dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     axios
  //       .get(GET_USER_PLAYLISTS_ENDPOINT(user.id), {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         dispatch({
  //           type: types.SET_USER_PLAYLISTS,
  //           userPlaylists: res.data.items,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   return;
  // }, [userToken, user, dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${GET_USER_TOP_TRACKS}?limit=20&time_range=short_term`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          dispatch({
            type: types.SET_USER_TOP_TRACKS,
            userTopTracks: res.data.items,
          })
        )
        .catch((err) => console.log(err));
    }
  }, [user, userToken, dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${GET_USER_TOP_ARTIST}?limit=20&time_range=long_term`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          dispatch({
            type: types.SET_USER_TOP_ARTIST,
            userTopArtist: res.data.items,
          })
        )
        .catch((err) => console.log(err));
    }
  }, [user, userToken, dispatch]);

  let tags = [];
  newReleases.map((release) => {
    return tags.push(release.name);
  });
  newReleases.map((release) => {
    return tags.push(release.artists[0].name);
  });

  const head = {
    title: 'StoreMelodi',
    description: 'The Music Discovery App To Find The Best CHUNES!',
    tags: tags,
  };

  const featuredItem = 0;
  const featuredItem2 = 1;
  const featuredItem3 = 2;
  const featuredItem4 = 3;

  return (
    <>
      <HeadTag
        title={head.title}
        description={head.description}
        tags={head.tags}
      />
      <section className={styles.container}>
        <section className={styles.innerContainer}>
          {/* Home Page Heading  */}
          <section className={styles.headingContainer}>
            <motion.div
              variants={animations.headingImage}
              initial="hidden"
              animate="visible"
            >
              <Image
                src={vinylShop}
                alt="vinyl-shop"
                width={1024}
                height={500}
                objectFit="cover"
              />
            </motion.div>
            <div className={styles.type}>
              <h1 className={styles.heading}>Discover</h1>
              <ReactRotatingText
                items={['something old', 'something new']}
                pause={3000}
                typingInterval={150}
                deletingInterval={130}
              />
            </div>
          </section>
          <FeaturedAlbum
            layout
            link={newReleases[featuredItem]?.id}
            image={newReleases[featuredItem].images[0]?.url}
            artist={newReleases[featuredItem]?.artists[0]?.name}
            followers={featuredArtist1?.followers.total}
            albumType={newReleases[featuredItem]?.album_type}
            title={newReleases[featuredItem]?.name}
            href={newReleases[featuredItem]?.external_urls.spotify}
            newAlbum
          />
          {/* User Top Tracks */}
          {userPlaylists && <UserTopTracks userTopTracks={userTopTracks} />}
          <NewReleases newReleases={newReleases} />
          <FeaturedAlbum
            link={newReleases[featuredItem2]?.id}
            image={newReleases[featuredItem2]?.images[0]?.url}
            artist={newReleases[featuredItem2]?.artists[0].name}
            followers={featuredArtist2?.followers.total}
            albumType={newReleases[featuredItem2]?.album_type}
            title={newReleases[featuredItem2]?.name}
            href={newReleases[featuredItem2]?.external_urls.spotify}
            newAlbum
          />
          {/* User Playlists */}
          {userPlaylists && <UserPlaylists userPlaylists={userPlaylists} />}
          <FeaturedPlaylists playlists={playlists} />
          <FeaturedAlbum
            layout
            link={newReleases[featuredItem3]?.id}
            image={newReleases[featuredItem3].images[0]?.url}
            artist={newReleases[featuredItem3]?.artists[0].name}
            followers={featuredArtist3?.followers.total}
            albumType={newReleases[featuredItem3]?.album_type}
            title={newReleases[featuredItem3]?.name}
            href={newReleases[featuredItem3]?.external_urls.spotify}
            newAlbum
          />
          <FeaturedGenre genre={popGenre} name="Pop" />
          <FeaturedGenre genre={hipHopGenre} name="Hip-Hop" />
          <FeaturedAlbum
            layout
            link={newReleases[featuredItem4]?.id}
            image={newReleases[featuredItem4].images[0]?.url}
            artist={newReleases[featuredItem4]?.artists[0].name}
            followers={featuredArtist4?.followers.total}
            albumType={newReleases[featuredItem4]?.album_type}
            title={newReleases[featuredItem4]?.name}
            href={newReleases[featuredItem4]?.external_urls.spotify}
            newAlbum
          />
        </section>
      </section>
    </>
  );
}
export async function getStaticProps() {
  let token = await GET_ACCESS_TOKEN();

  const getData = async (url) => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.data;
      return data;
    } catch (error) {
      console.log({ error: error.message });
    }
  };
  //------>
  let newReleasesData = await getData(`${NEW_RELEASES_ENDPOINT}?limit=8`);
  let newReleases = await newReleasesData.albums.items;
  // ------>

  let featuredArtist1 = await getData(
    `${ARTIST_ENDPOINT}${newReleases[0].artists[0].id}`
  );

  let featuredArtist2 = await getData(
    `${ARTIST_ENDPOINT}${newReleases[1].artists[0].id}`
  );

  let featuredArtist3 = await getData(
    `${ARTIST_ENDPOINT}${newReleases[2].artists[0].id}`
  );

  let featuredArtist4 = await getData(
    `${ARTIST_ENDPOINT}${newReleases[3].artists[0].id}`
  );

  let playlistsData = await getData(`${FEATURED_PLAYLIST_ENDPOINT}&limit=4`);
  let playlists = await playlistsData.playlists.items;
  //------->
  //get pop category picks
  let popGenreData = await getData(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=pop&limit=4`
  );
  let popGenre = await popGenreData.tracks;
  //------->
  //get hip-hop category picks
  let hipHopGenreData = await getData(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=hip-hop&limit=4`
  );
  let hipHopGenre = await hipHopGenreData.tracks;

  return {
    props: {
      newReleases,
      playlists,
      featuredArtist1,
      featuredArtist2,
      featuredArtist3,
      featuredArtist4,
      popGenre,
      hipHopGenre,
    },
    revalidate: 86400,
  };
}

const NewReleases = ({ newReleases }) => {
  return (
    <motion.section className={styles.newReleases}>
      <motion.h2
        variants={animations.headers}
        initial="hidden"
        animate="visible"
      >
        New Releases
      </motion.h2>
      <div className={styles.grid}>
        {newReleases?.slice(4, 8).map((release, idx) => {
          return (
            <SmallAlbumCard
              idx={idx}
              src={release?.images[1]?.url}
              alt={release?.name}
              key={release?.id}
              title={release?.name}
              name={release?.artists[0].name}
              href={`/album/${release?.id}`}
            />
          );
        })}
      </div>
    </motion.section>
  );
};

const FeaturedPlaylists = ({ playlists }) => {
  return (
    <section className={styles.newReleases}>
      <motion.h2
        variants={animations.headers}
        initial="hidden"
        animate="visible"
      >
        Featured Playlist
      </motion.h2>
      <div className={styles.grid}>
        {playlists?.map((playlist, idx) => {
          return (
            <SmallAlbumCard
              idx={idx}
              src={playlist?.images[0]?.url}
              alt={playlist?.name}
              key={playlist?.id}
              title={playlist?.name}
              name={playlist?.description}
              href={`/playlist/${playlist?.id}`}
            />
          );
        })}
      </div>
    </section>
  );
};

const FeaturedGenre = ({ genre, name }) => {
  return (
    <section className={styles.newReleases}>
      <h2>{`Editors ${name} Album Picks`}</h2>
      <div className={styles.grid}>
        {genre?.map((x, idx) => {
          return (
            <SmallAlbumCard
              idx={idx}
              src={x?.album.images[1]?.url}
              alt={x?.name}
              key={x?.id}
              title={x?.album.name}
              name={x?.album.artists[0].name}
              href={`/album/${x?.album.id}`}
            />
          );
        })}
      </div>
    </section>
  );
};

const UserTopTracks = ({ userTopTracks }) => {
  return (
    <motion.section className={styles.newReleases}>
      <motion.h2
        variants={animations.headers}
        initial="hidden"
        animate="visible"
      >
        My Recent Top Songs
      </motion.h2>
      <div className={styles.grid}>
        {userTopTracks.slice(0, 4)?.map((track, idx) => {
          return (
            <SmallAlbumCard
              idx={idx}
              src={track?.album.images[1]?.url}
              alt={track?.name}
              key={track?.id}
              title={track?.album.name}
              name={track?.album.artists[0].name}
              href={`/album/${track?.album.id}`}
            />
          );
        })}
      </div>
    </motion.section>
  );
};

const UserPlaylists = ({ userPlaylists }) => {
  <section className={styles.newReleases}>
    <motion.h2 variants={animations.headers} initial="hidden" animate="visible">
      My Top Playlists
    </motion.h2>
    <div className={styles.grid}>
      {userPlaylists.slice(0, 4)?.map((playlist, idx) => {
        return (
          <SmallAlbumCard
            idx={idx}
            src={playlist?.images[0]?.url}
            alt={playlist?.name}
            key={playlist?.id}
            title={playlist?.name}
            name={
              playlist?.description ? playlist?.description : playlist?.name
            }
            href={`/playlist/${playlist?.id}`}
          />
        );
      })}
    </div>
  </section>;
};
