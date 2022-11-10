import React from 'react'
import './App.css'
import { useLoaderData, defer, Await, useAsyncValue, useAsyncError } from 'react-router-dom'


export const loader = async () => {
  
  const critical1Promise = fetch('/test?text=critical1&delay=250').then(res => res.json());
  const critical2Promise = fetch('/test?text=critical2&delay=500').then(res => res.json());
  const lazyResolvedPromise = fetch('/test?text=lazyResolved&delay=100').then(res => res.json());
  const lazy1Promise = fetch('/test?text=lazy1&delay=500').then(res => res.json());
  const lazy2Promise = fetch('/test?text=lazy2&delay=1500').then(res => res.json());
  const lazy3Promise = fetch('/test?text=lazy3&delay=2500').then(res => res.json());
  const lazyErrorPromise = fetch('/test?text=lazy3&delay=3000').then(res => { 
        throw Error('Oh noo!')
  });

  // parallel fetch
  return defer({
      critical1: await critical1Promise,
      critical2: await critical2Promise,
      lazyResolved: lazyResolvedPromise,
      lazy1: lazy1Promise,
      lazy2: lazy2Promise,
      lazy3: lazy3Promise,
      lazyError: lazyErrorPromise
  })

  // // waterfall fetch, don't copy this code
  // return defer({
  //   critical1: await fetch('/test?text=critical1&delay=250').then(res => res.json()),
  //   critical2: await fetch('/test?text=critical2&delay=500').then(res => res.json()),
  //   lazyResolved: fetch('/test?text=lazyResolved&delay=100').then(res => res.json()),
  //   lazy1: fetch('/test?text=lazy1&delay=1000').then(res => res.json()),
  //   lazy2: fetch('/test?text=lazy2&delay=1500').then(res => res.json()),
  //   lazy3: fetch('/test?text=lazy3&delay=2000').then(res => res.json()),
  //   lazyError: fetch('/test?text=lazy3&delay=2500').then(res => { 
  //     throw Error('Oh noo!')
  //   }),
  // })
}

function RenderAwaitedData() {
  let data = useAsyncValue();
  return <p>{data.text}</p>;
}

function RenderAwaitedError() {
  let error = useAsyncError();
  return (
    <p style={{ color: "red" }}>
      Error (errorElement)!
      <br />
      {error.message} {error.stack}
    </p>
  );
}

function App() {
  const data = useLoaderData();

  // console.log(data);

  return (
    <div className="App">
    <p>{data.critical1.text}</p>
      <p>{data.critical2.text}</p>

      <React.Suspense fallback={<p>loading... should not see me!</p>}>
        <Await resolve={data.lazyResolved}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 1...</p>}>
        <Await resolve={data.lazy1}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 2...</p>}>
        <Await resolve={data.lazy2}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 3...</p>}>
        <Await resolve={data.lazy3}>{(data) => <p>{data.text}</p>}</Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading (error)...</p>}>
        <Await resolve={data.lazyError} errorElement={<RenderAwaitedError />}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>
    </div>
  )
}

export default App
