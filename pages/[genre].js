import React from 'react';
import axios from 'axios';
import {
  GENRE_ENDPOINT,
  GET_ACCESS_TOKEN,
  RECOMMENDATIONS_ENDPOINT,
} from '../lib/spotify';
import HeadTag from '../components/Head';
import styles from '../styles/Genre.module.scss';
import GenreRecommendedTracks from '../components/GenreRecommendedTracks';
import Footer from '../components/Footer';

const Genre = ({ genre, tracks }) => {
  console.log(tracks);
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
    <div>
      <HeadTag
        title={head.title}
        description={head.description}
        tags={head.tags}
      />

      <main className={styles.container}>
        <section className={styles.innerContainer}>
          <h2 className={styles.heading}>{`Suggested ${genre}`}</h2>
          <span className={styles.subTitle}>
            A selection of curated {genre} albums
          </span>
        </section>
        <section className={styles.gridContainer}>
          <GenreRecommendedTracks tracks={tracks} />
        </section>
      </main>
    </div>
  );
};

export default Genre;

export async function getStaticPaths() {
  let token = await GET_ACCESS_TOKEN();
  let genres = await axios(GENRE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data.genres);

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
  let data = await axios(RECOMMENDATIONS_ENDPOINT + params.genre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data.tracks);

  return {
    props: { genre: params.genre, tracks: data },
  };
}
