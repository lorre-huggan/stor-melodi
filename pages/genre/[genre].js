import React from 'react';
import axios from 'axios';
import {
  GENRE_ENDPOINT,
  GET_ACCESS_TOKEN,
  RECOMMENDATIONS_ENDPOINT,
} from '../../lib/spotify';
import HeadTag from '../../components/Head';
import styles from './styles.module.scss';
import GenreRecommendedTracks from '../../components/GenreRecommendedTracks';

const Genre = ({ genre, tracks }) => {
  //set album titles to meta tags
  let tags = [];
  tracks.map((track) => {
    return tags.push(track.album.name);
  });

  const head = {
    title: genre,
    description: 'Best to place to find your next music experience',
    tags: tags.toString(),
  };

  return (
    <>
      <HeadTag
        title={head.title.toUpperCase()}
        description={head.description}
        tags={head.tags}
      />

      <section className={styles.container}>
        <section className={styles.innerContainer}>
          <h1 className={styles.heading}>{genre}</h1>
          <span className={styles.subTitle}>
            A curated selection of {genre} albums.
          </span>
        </section>
        <section className={styles.gridContainer}>
          <GenreRecommendedTracks tracks={tracks} />
        </section>
      </section>
    </>
  );
};

export default Genre;

export async function getStaticPaths() {
  let token = await GET_ACCESS_TOKEN();
  let genres = await axios(GENRE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data.genres)
    .catch((error) => console.log(error));

  const paths = genres.map((genre) => {
    return { params: { genre } };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let token = await GET_ACCESS_TOKEN();
  let data = await axios(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=${params.genre}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data.tracks)
    .catch((error) => console.log(error));

  return {
    props: { genre: params.genre, tracks: data },
  };
}
