/** Ensure we cleanup properly */
function tearDown(done) {
  if (router.running)
    router.stop().then(() => {
      window.history.pushState(null, null, '/')
      done()
    }).catch(failAsyncTest)
  else {
    window.history.pushState(null, null, '/')
    done()
  }
}
