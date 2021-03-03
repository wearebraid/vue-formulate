<template>
  <div>
    <div class="demo">
      <!-- debug the model variable here for reference -->
      <div class="red">
        <div>DEBUG: groupModel is currently:</div>
        <pre
          v-text="groupModel"
        />
      </div>
      <!-- main form container -->
      <FormulateForm>
        <!-- the grouping input, with a local v-model specific to this group -->
        <FormulateInput
          v-model="groupModel"
          type="group"
          name="question"
          :repeatable="false"
        >
          <!-- for loop to output each checkbox of the "question" mini-schema -->
          <FormulateInput
            v-for="child in question.children"
            :key="child.name"
            v-bind="child"
          />
        </FormulateInput>
      </FormulateForm>
      <!-- button to try to change the values of the model -->
      <button @click="setNewValues">
        Set New Values
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupModel: undefined, // initialise the model to nothing
      question: {
        // the children items for this question, which is a list of checkboxes
        children: [
          {
            name: 'course_A',
            type: 'checkbox',
            label: 'Label for Course A',
            options: [
              {
                value: 'ABC',
                label: 'This is the ABC option'
              },
              {
                value: 'DEF',
                label: 'This is the DEF option'
              }
            ]
          },
          {
            name: 'course_B',
            type: 'checkbox',
            label: 'Label for Course B',
            options: [
              {
                value: 'XYZ',
                label: 'This is the XYZ option'
              }
            ]
          }
        ]
      }

    }
  },
  methods: {
    setNewValues () {
      // PROBLEM: attempting to set the groupModel variable to a new value to update the group does not actually update the group, and gets overwritten to empty strings again:
      console.log('doing setting new values')
      this.$set(this, 'groupModel', [
        {
          course_A: ['ABC', 'DEF'],
          course_B: ['XYZ']
        }
      ])
      // can also try directly:
      this.groupModel = [
        {
          course_A: ['ABC', 'DEF'],
          course_B: ['XYZ']
        }
      ]
    }
  }
}
</script>
