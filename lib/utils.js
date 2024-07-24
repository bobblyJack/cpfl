function tabs(stop = 1) {
    return '\t'.repeat(stop);
}

async function attempt(fn) {
    try {
      return await fn();
    } catch (lg) {
      console.error(`error! ${lg}`);
      throw lg;
    }
}

module.exports = { 
    tabs,
    attempt
}