# next.js-basic notes

## Setup
npx create-next-app

Next.js is built around the concept of pages. A page is a React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory.

### 对应的url
Pages are associated with a route based on their file name. For example pages/about.js is mapped to /about. 
和function的名字无关 和file name有关
不写名字直接export default xxx 也可以

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
    props: {
      posts,
    },
  }
}

export default Blog
```
To fetch this data on pre-render, Next.js allows you to export an async function called getStaticProps from the same file. This function gets called at build time and lets you pass fetched data to the page's props on pre-render.

getStaticPaths(usually in addition to getStaticProps)
```
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))
  // paths = [{params:{id:1}},{params:{id:2}}].....
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```
Can I pre-render this page ahead of a user's request ? yes?- > Static generation

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


对于每个page都可以选择其中一种 一个app可以同时拥有这两种


