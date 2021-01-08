<template>
  <!-- eslint-disable -->
  <div class="w-full py-12 flex-row items-start justify-start gap-12">
    <pre>{{ model }}</pre>
    <!-- <FormulateForm> -->
      <FormulateInput
        type="group"
        name="test"
        v-model="model"
      >
        <FormulateInput
          name="username"
          type="text"
        />
        <FormulateInput
          name="email"
          type="text"
          validation="email"
        />
      </FormulateInput>
    <!-- </FormulateForm> -->
    <button @click="setGroupValue">Click</button>
    <FormulateInput
      type="group"
      v-model="groupValues"
      :repeatable="true"
      :minimum="5"
    >
      <FormulateInput
        v-model="name"
        name="name"
      />
    </FormulateInput>
    <button @click="setGroupValue">Click This</button>

    <div class="w-full p-12 flex items-start justify-start gap-12">
      Not watched? maybe we should use a watcher in each group to react to external changes?
      <FormulateInput
        type="group"
        name="friends2"
        :repeatable="true"
        help="The group won't sync"
        v-model="values"
      >
        <FormulateInput type="text" name="name"/>
      </FormulateInput>
      <div class="w-1/4">
        <div class="pb-3 font-semibold h-24">Using FormulateInput (Group)</div>
        <FormulateInput
          type="group"
          name="friends"
          :repeatable="true"
          help="The group won't sync"
          v-model="values"
        >
          <FormulateInput type="text" name="name"/>
        </FormulateInput>
      </div>

      <div class="w-1/4">
        <div class="pb-3 font-semibold h-24">Values</div>
        {{values}}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data: () => ({
    model: [
      {
        username: 'person', email: 'person@example'
      }
    ],
    changeTime: "",
    values: [
      {
        name: "Teddy"
      }
    ],
    groupValues: [
      { name: 'tom@wearebraid.com' },
      { name: 'jim@wearebraid.com' }
    ],
    name: 'bill@wearebraid.com',
    formValues: {
      name: 'Justin',
      email: 'justin@wearebraid.com'
    },
    schema: [
      {
        name: "random",
        label: "Some text",
        help: "This text will be synced"
      },
      {
        type: "group",
        name: "friends",
        repeatable: true,
        label: "Friends",
        addLabel: "+ Add a friend",
        help: "The children won't sync",
        children: [
          {
            type: "text",
            label: "Name",
            name: "name"
          }
        ]
      }
    ]
  }),
  computed: {
    friends: {
      get () {
        return this.values.friends
      },
      set (value) {
        this.values = { ...this.values, friends: value }
      }
    }
  },
  methods: {
    setGroupValue () {
      this.model[1].username = "Party"
    },
    setName () {
      this.formValues.name = "Andrew"
    }
  }
};
</script>

