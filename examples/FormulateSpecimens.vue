<template>
  <div id="app">
    <SpecimenGroup />
    <SpecimenText />
  </div>
</template>

<script>
import SpecimenText from './specimens/SpecimenText'
import SpecimenGroup from './specimens/SpecimenGroup'

export default {
  name: 'App',
  components: {
    SpecimenText,
    SpecimenGroup
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
.specimens {
  margin-bottom: 2em;
  padding-bottom: 2em;
  border-bottom: 1px solid gray;

  &:last-child {
    border-bottom: 0;
  }
}
</style>
