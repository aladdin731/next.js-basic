# next.js-basic notes

## Setup
npx create-next-app

Next.js is built around the concept of pages. A page is a React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory.

### 对应的url
Pages are associated with a route based on their file name. For example pages/about.js is mapped to /about. 
和function的名字无关 和file name有关
不写名字直接export default xxx 也可以
pages/index.js is associated with the / route.

### dynammic routes
Next.js supports pages with dynamic routes. For example, if you create a file called pages/posts/[id].js, then it will be accessible at posts/1, posts/2, etc.


## start the application 
npm run dev
and go to http://localhost:3000

## Pre-rendering
This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Pre-rendering can result in better performance and SEO.

### Hydration
Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive

### Two Forms - Static Generation（recommended for performan reasons） && Server-side Rendering
The difference is in when it generates the HTML for a page

#### SGR
HTML is generated at build time and will be reused on each request
That means in production, the page HTML is generated when you run `next build`.
In development (next dev), getStaticProps will be called on every request.
Statically generated pages can be cached by CDN with no extra configuration to boost performance.???

##### without data
can statically generate pages with or without data(does not need to fetch any external data to be pre-rendered)
generates a single HTML file per page during build time

##### with data -- content/paths depend on external data
getStaticProps
```
function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time 
  return {
    props: { // 这就是component里的props
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  }
}

export default Blog
```
To fetch this data on pre-render, Next.js allows you to export an async function called getStaticProps from the same file. This function gets called at build time and lets you pass fetched data to the page's props on pre-render.

you can write code such as direct database queries without them being sent to browsers. You should not fetch an API route from getStaticProps — instead, you can write the server-side code directly in getStaticProps.

getStaticProps can only be exported from a page. You can’t export it from non-page files.

getStaticPaths(usually in addition to getStaticProps)
```
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  // paths are key words here
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))
  // paths = [{params:{id:1}},{params:{id:2}}].....
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```
You cannot use getStaticPaths with getServerSideProps.


Can I pre-render this page ahead of a user's request ? yes?- > Static generation



#### Incremental Static Regeneration
 Incremental Static Regeneration allows you to update existing pages by re-rendering them in the background as traffic comes in.
// Next.js will attempt to re-generate the page:
// - When a request comes in
// - At most once every second
revalidate: 1, // In seconds

#### Server-side Rendering or Dynamic Rendering
The HTML is generated on each request
your page needs to pre-render frequently updated data (fetched from an external API). 
getServerSideProps
```
function Page({ data }) {
  // Render data...
}

// This gets called on every request

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```
getServerSideProps is similar to getStaticProps, but the difference is that getServerSideProps is run on every request instead of on build time.
results in slower performance than Static Generation, use this only if absolutely necessary.



对于每个page都可以选择其中一种 一个app可以同时拥有这两种'

## SEO (search engine optimization) 搜索引擎引流
SEO stands for search engine optimization, which is the activity of optimizing your website to get more organic traffic from search engines. SEO involves a lot of different techniques and aspects that we should pay attention to to make our website more attractive and accessible to a search engine.

## Single-Page Application and Server-rendered application
### SPA
better performance(no need to load a new HTML page every time)
but a lack of SEO results
cannot be properly indexed by search engines


### Server-rendered-application 
achieve better SEO results in search engines 
and still have a pretty decent performance.

Here are some things that you should pay attention to in order to get a nice SEO result:
Meta tags
Accessibility
Progressive web apps


#### Navigation -> Link a
{' '} adds an empty space, which is used to divide text over multiple lines.
The Link component enables client-side navigation between two pages in the same Next.js app.
Client-side navigation means that the page transition happens using JavaScript, which is faster than the default navigation done by the browser.
```
<Link href="/">
  <a>Back to home</a>
</Link>
```
Code splitting 只load该page需要的东西
有link的时候 会 prefetch the code for the linked page 

If you need to link to an external page outside the Next.js app, just use an <a> tag without Link.

### Assets
Files inside public can be referenced from the root of the application similar to pages.
src="/images/profile.jpg"

#### Image Component
Instead of optimizing images at build time, Next.js optimizes images on-demand, as users request them. 
build times aren't increased, whether shipping 10 images or 10 million images.
import Image from 'next/image' // Resizing & optimizing images 

### Metadata Head React Component
import Head from 'next/head'
<Head>
  <title>First Post</title> 
</Head>
// the browser tab -> First Post

### CSS Styling
CSS Module automatically generates unique class names. don’t have to worry about class name collisions.
To use CSS Modules, the CSS file name must end with .module.css.
import styles from './xx.module.css'
className={styles.class-name-you-defined}

#### Global Styles --   pages/_app.js
CSS Modules are useful for component-level styles. 
But if you want some CSS to be loaded by every page, create a file called pages/_app.js 
need to restart the development server when you add pages/_app.js.

#### classnames --- a library to toggle classes
npm install classnames
import cn from 'classnames'
```
<div
      className={cn({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error'
      })}
    >
      {children}
</div>
```

#### Tailwind CSS
create top-level fill postcss.config.js
```
module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ]
  ],
  purge: [
    // Use *.tsx if using TypeScript
    './pages/**/*.js',
    './components/**/*.js'
  ]
}
```
npm install tailwindcss postcss-preset-env postcss-flexbugs-fixes

