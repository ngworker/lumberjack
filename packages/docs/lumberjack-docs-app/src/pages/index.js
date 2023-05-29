import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to use',
    imageUrl: 'img/logo.svg',
    description: <>Lumberjack is ruled by the principle of making the simple easy and the complex possible</>,
  },
  {
    title: 'Extensible',
    imageUrl: 'img/logo.svg',
    description: (
      <>
        Being powered by a Plugin Architecture, allows anyone to create its own drivers and make Lumberjac fit their
        needs
      </>
    ),
  },
  {
    title: 'Configurable',
    imageUrl: 'img/logo.svg',
    description: (
      <>
        Custom Plugins is not the only way to customize Lumberjack. It is possible to modify almost every aspect of how
        your logs will be processed, from the format function to the log levels allowed.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`${siteConfig.title}`} description="Chop and cut Angular logs like a professional lumberjack.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
                styles.readMore
              )}
              to={useBaseUrl('docs/installation')}
            >
              Read the docs
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
