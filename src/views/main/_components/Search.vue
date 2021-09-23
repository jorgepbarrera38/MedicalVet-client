<template>
    <div>
        <div class="input-group mb-3 form-group">
          <input type="text" class="form-control" v-model="search" @keyup.enter="emitSearch" :placeholder="label">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="emitSearch">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['label'],
        data() {
            return {
                search: ''
            }
        },
        methods: {
            emitSearch () {
                this.$emit('data-search', this.search)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>