<template>
  <div
    id="app"
    class="specimen-list"
  >
    <SpecimenButton />
    <SpecimenBox />
    <SpecimenFile />
    <SpecimenGroup />
    <SpecimenSelect />
    <SpecimenSlider />
    <SpecimenText />
    <SpecimenTextarea />
  </div>
</template>

<script>
import SpecimenText from './specimens/SpecimenText'
import SpecimenTextarea from './specimens/SpecimenTextarea'
import SpecimenGroup from './specimens/SpecimenGroup'
import SpecimenFile from './specimens/SpecimenFile'
import SpecimenButton from './specimens/SpecimenButton'
import SpecimenBox from './specimens/SpecimenBox'
import SpecimenSlider from './specimens/SpecimenSlider'
import SpecimenSelect from './specimens/SpecimenSelect'

export default {
  name: 'App',
  components: {
    SpecimenButton,
    SpecimenBox,
    SpecimenText,
    SpecimenTextarea,
    SpecimenGroup,
    SpecimenFile,
    SpecimenSlider,
    SpecimenSelect
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
  margin: 0;
  padding: 0;
  font-family: $formulate-font-stack;
}
h2 {
  display: block;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: white;
  padding: .5em 0;
  color: $formulate-green;
  border-bottom: 1px solid $formulate-gray;
  margin: 2em 0 0 0;
  z-index: 10;
}
.specimen-list {
  padding: 1em;
  max-width: 1200px;
  margin: 0 auto;
  @media (min-width: 756px) {
    padding: 2em;
  }

}
.specimens {
  @media (min-width: 500px) {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  &:last-child {
    border-bottom: 0;
  }
}

.specimen {
  max-width: 400px;
  padding: 1em;
  box-sizing: border-box;

  @media (min-width: 500px) {
    width: 50%;
    border-bottom: 1px solid $formulate-gray;
    &:nth-of-type(odd) {
      border-right: 1px solid $formulate-gray;
    }
  }

  @media (min-width: 900px) {
    width: 33.332%;
    border-right: 1px solid $formulate-gray;

    &:nth-of-type(3n) {
      border-right: 0;
    }
  }
}
</style>
