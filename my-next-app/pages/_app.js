import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp


// This App component is the top-level component 
// which will be common across all the different pages. 
// You can use this App component to keep state 
// when navigating between pages