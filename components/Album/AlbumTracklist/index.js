import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.scss';
import { useAppStateValue } from '../../../context/AppProvider';
import { types } from '../../../reducers/appReducer';
import { MsToMinsAndSeconds } from '../../../utils/MsToMins';
import { Howler, Howl } from 'howler';
import { motion } from 'framer-motion';
import { BsPlayCircle, BsStopCircle } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';

const AlbumTracklist = ({ album, copyright, features, src }) => {
  return (
    <>
      <motion.div className={styles.container}>
        <div className={styles.featureIdx}>
          <div className={`${styles.pin} ${styles.dancePin}`}></div>
          <span>Dance-ability</span>
        </div>
        <div className={styles.featureIdx}>
          <div className={`${styles.pin} ${styles.energyPin}`}></div>
          <span>Energy</span>
        </div>
        <div className={styles.featureIdx}>
          <div className={`${styles.pin} ${styles.acousticPin}`}></div>
          <span>Acoustic-ness</span>
        </div>
      </motion.div>
      {/*TRACKS*/}
      <motion.div>
        <Tracks album={album} features={features} src={src} />
      </motion.div>
      <span className={styles.copyright}>{copyright}</span>
    </>
  );
};

export default AlbumTracklist;

const Tracks = ({ album, features, src }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPhone, setIsPhone] = useState(200);
  const [noPreview, setNoPreview] = useState(false);
  const [{ playing, itemPlaying }, dispatch] = useAppStateValue();

  useEffect(() => {
    if (window.innerWidth < 820) {
      return setIsMobile(true);
    } else {
      return setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 500) {
      console.log('phone...');
      setIsPhone(30);
      return;
    } else {
      return setIsPhone(200);
    }
  }, []);

  return album?.tracks.items.map((song, idx) => {
    const trackFeatures = features.filter((feature) => {
      return feature?.id === song?.id;
    });
    //framer motion animation variants
    const animations = {
      trackVariant: {
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            delay: idx * 0.2,
            duration: 0.2,
            ease: 'easeOut',
          },
        },
      },
      danceVariant: {
        hidden: {
          opacity: 0,
          width: 0,
        },
        visible: {
          opacity: 1,
          width: `${Math.floor(trackFeatures[0]?.danceability * 100)}%`,
          transition: {
            delay: idx * 0.2,
            duration: 0.3,
            type: 'spring',
            stiffness: 90,
          },
        },
      },
      energyVariant: {
        hidden: {
          opacity: 0,
          width: 0,
        },
        visible: {
          opacity: 1,
          width: `${Math.floor(trackFeatures[0]?.energy * 100)}%`,
          transition: {
            delay: idx * 0.3,
            duration: 0.3,
            type: 'spring',
            stiffness: 90,
          },
        },
      },
      acousticVariant: {
        hidden: {
          opacity: 0,
          width: 0,
        },
        visible: {
          opacity: 1,
          width: `${Math.floor(trackFeatures[0]?.acousticness * 100)}%`,
          transition: {
            delay: idx * 0.4,
            duration: 0.3,
            type: 'spring',
            stiffness: 90,
          },
        },
      },
    };

    // Play dispatch function
    const player = new Howl({
      src: song?.preview_url,
      html5: true,
      volume: 0.3,
      onplay: () => {
        dispatch({
          type: types.SET_PLAYING,
          playing: true,
        });
        dispatch({
          type: types.SET_ITEM_PLAYING,
          itemPlaying: song,
        });
      },
      onend: () => {
        dispatch({
          type: types.SET_PLAYING,
          playing: false,
        });
        dispatch({
          type: types.SET_ITEM_PLAYING,
          itemPlaying: null,
        });
      },
    });

    const handlePlay = () => {
      if (!song.preview_url) {
        setNoPreview(true);
      }
      if (itemPlaying) {
        return handleStop();
      }
      if (song.preview_url) {
        player.play();
      } else {
        return;
      }
    };
    const handleStop = () => {
      Howler.stop();
      dispatch({
        type: types.SET_PLAYING,
        playing: false,
      });
      dispatch({
        type: types.SET_ITEM_PLAYING,
        itemPlaying: null,
      });
    };

    return (
      <motion.section
        variants={animations.trackVariant}
        initial="hidden"
        animate="visible"
        key={song?.id}
        className={styles.trackContainer}
      >
        <div className={styles.track}>
          <div className={styles.numAndPlay}>
            {/* Track Number */}
            <div>
              {song?.id === itemPlaying?.id && song.preview_url ? (
                <div
                  className={`${styles.numberCircle} ${styles.circlePlaying}`}
                  style={{
                    animationDuration: `${Math.floor(
                      trackFeatures[0]?.tempo * 12
                    )}ms`,
                  }}
                >
                  <Image
                    src={src}
                    alt={album?.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className={styles.numberCircle}>
                  <div className={styles.number}>{idx + 1}</div>
                </div>
              )}
            </div>
            {/* Mobile Play Button  */}
            <>
              {song?.id === itemPlaying?.id ? (
                <div
                  className={`${styles.playButton} ${styles.playButtonPlaying}`}
                  onClick={handleStop}
                >
                  <BsStopCircle />
                </div>
              ) : song.preview_url ? (
                <div className={styles.playButton} onClick={handlePlay}>
                  <BsPlayCircle />
                </div>
              ) : (
                <div className={styles.playButton}>
                  <AiOutlineClose />
                </div>
              )}
            </>
          </div>

          {/*song features*/}
          <div className={styles.featureContainer}>
            {/* danceability */}
            <motion.div
              variants={animations.danceVariant}
              initial="hidden"
              animate="visible"
              className={`${styles.danceBar} ${styles.bar}`}
              style={{
                width: `${Math.floor(trackFeatures[0]?.danceability * 100)}%`,
              }}
            ></motion.div>
            {/* energy */}
            <motion.div
              variants={animations.energyVariant}
              initial="hidden"
              animate="visible"
              className={`${styles.energyBar} ${styles.bar}`}
              style={{
                width: `${Math.floor(trackFeatures[0]?.energy * 100)}%`,
              }}
            ></motion.div>
            {/* acoustic */}
            <motion.div
              variants={animations.acousticVariant}
              initial="hidden"
              animate="visible"
              className={`${styles.acousticBar} ${styles.bar}`}
              style={{
                width: `${Math.floor(trackFeatures[0]?.acousticness * 100)}%`,
              }}
            ></motion.div>
          </div>

          {/* Track Information */}
          <div className={styles.trackInfo}>
            <div className={styles.trackTitle}>
              <div className={styles.titleAndTime}>
                <Link href={song?.external_urls.spotify} passHref>
                  <span className={styles.songName}>
                    {`${song?.name.substring(0, isPhone)}${
                      song?.name.length > isPhone ? '...' : ''
                    }`}
                  </span>
                </Link>

                <span className={styles.ms}>
                  {MsToMinsAndSeconds(song?.duration_ms)}
                </span>
              </div>
            </div>
            <div className={styles.meta}>
              {song?.artists.slice(0, 3).map((artist) => {
                return (
                  <Link
                    key={artist?.id}
                    href={artist?.external_urls.spotify}
                    passHref
                  >
                    <a target="_blank">
                      <p key={artist?.id}>{artist?.name}</p>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>
    );
  });
};
