<template>
  <div id="app">
    <SpecimenText />
  </div>
</template>

<script>
import SpecimenText from './specimens/SpecimenText'

export default {
  name: 'App',
  components: {
    SpecimenText
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import '../themes/snow/snow.scss';
body {
  font-family: $formulate-font-stack;
}
</style>
