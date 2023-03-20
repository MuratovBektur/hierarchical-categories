<template>
  <tr class="tr text-center">
    <td
      @click="showChildren = !showChildren"
      class="flex items-center space-x-2"
      :style="{
        paddingLeft: `${nestingLevel * 25}px`,
        cursor: isCategoryHasChildren ? 'pointer' : 'auto',
      }"
    >
      <div v-if="isCategoryHasChildren">
        <img
          class="w-5"
          :class="{ 'rotate-180': showChildren }"
          src="@/assets/chevron-down.svg"
          alt="chevron"
        />
      </div>
      <div v-else class="w-5 h-5"></div>
      <div class="truncate" :alt="category.title">
        {{ category.title }}
      </div>
    </td>
    <td>
      {{ category.countView }}
    </td>
    <td>
      {{ category.countPlay }}
    </td>
    <td>
      {{ category.countSend }}
    </td>
    <div>
      {{ category.countOrder }}
    </div>
    <td>
      {{ category.countPay }}
    </td>
    <td>
      {{ category.viewSend }}
    </td>
    <td>
      {{ category.viewPay }}
    </td>
  </tr>

  <!-- nested categories -->

  <template v-if="showChildren && isCategoryHasChildren">
    <Category
      :category="subcategory"
      :nestingLevel="nestingLevel + 1"
      :id="category.id"
      v-for="subcategory of category.children"
    />
  </template>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { toRefs, computed, ref, type PropType } from "vue";

import type { ICategory } from "@/types";

const props = defineProps({
  category: {
    required: true,
    type: Object as PropType<ICategory>,
  },
  nestingLevel: {
    required: false,
    default: 1,
    type: Number,
  },
});

const { category, nestingLevel } = toRefs(props);

const isCategoryHasChildren = computed(() => !!category.value.children?.length);

const showChildren = ref<boolean>(false);
</script>
