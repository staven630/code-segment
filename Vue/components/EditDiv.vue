<template>
  <div
    class="contenteditable"
    contenteditable
    @blur="updateContent"
    v-html="content"
  ></div>
</template>

<script>
export default {
  props: {
    editClass: {
      type: String
    }
  },
  data() {
    return {
      contents: []
    };
  },

  computed: {
    content() {
      let html = "";
      for (let text of this.contents) {
        html += `<span>${text}</span>`;
      }
      return html;
    }
  },
  methods: {
    updateContent(e) {
      this.contents = e.target.innerText.split("");
      this.$emit("change", this.contents);
    }
  }
};
</script>

<style scoped>
.contenteditable {
  padding: 5px 10px;
  text-align: left;
}

.contenteditable:focus {
  outline: none;
}
</style>
