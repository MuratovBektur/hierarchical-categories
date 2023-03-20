<template>
  <!-- on fetch error -->

  <div v-if="isFetchError" class="mt-10 flex flex-col items-center">
    <img class="w-[10rem]" src="@/assets/error.svg" alt="error" />
    <h2 class="mt-5 text-2xl font-bold">Ошибка при загрузки</h2>
  </div>

  <!-- on fetch success -->

  <div class="relative" v-else>
    <!-- loading spinner on fetching -->

    <div
      v-if="isFetching"
      class="absolute z-10 left-0 top-0 w-full h-full bg-slate-500/20 flex justify-center items-center cursor-wait"
    >
      <div
        class="w-12 h-12 rounded-full animate-spin border-4 border-solid border-[tomato] border-t-transparent"
      ></div>
    </div>

    <!-- categories header -->

    <table class="w-full text-left overflow-auto">
      <thead>
        <tr class="tr">
          <th>Категория</th>
          <th
            @click="sortCategories(category)"
            v-for="category of categoryTitles"
            :key="category"
          >
            <div class="cursor-pointer flex items-center space-x-1">
              <span>{{ category }}</span>
              <img
                v-if="selectedSortType === category"
                class="w-5"
                :class="{
                  'rotate-180': selectedSortDirection === sortDirections[1],
                }"
                src="@/assets/arrow-up.svg"
                alt="arrow"
              />
            </div>
          </th>
        </tr>
      </thead>

      <!-- categories -->

      <tbody>
        <Category
          :category="category"
          v-for="category of categories"
          :id="category.id"
        />
      </tbody>

      <!-- categories total -->

      <tfoot class="text-center" v-if="categoryTotal">
        <tr class="bg-neutral-200">
          <td class="text-left py-4">Итого</td>
          <td>{{ categoryTotal.countView }}</td>
          <td>{{ categoryTotal.countPlay }}</td>
          <td>{{ categoryTotal.countSend }}</td>
          <td>{{ categoryTotal.countOrder }}</td>
          <td>{{ categoryTotal.countPay }}</td>
          <td>{{ categoryTotal.viewSend }}%</td>
          <td>{{ categoryTotal.viewPay }}%</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import type { ICategory, ICategoryTotal, IFetchedCategories } from "@/types";
import api from "@/utils/api";
import Category from "./category.vue";
import { sleep } from "@/utils/fn";

const categories = ref<Array<ICategory>>([]);
const categoryTotal = ref<ICategoryTotal | null>(null);
const isFetchError = ref<boolean>(false);
const isFetching = ref<boolean>(false);

const categoryTitles = [
  "countView",
  "countPlay",
  "countSend",
  "countOrder",
  "countPay",
  "viewSend",
  "viewPay",
] as const;

const sortDirections = ["asc", "desc"] as const;

type categoryTitleType = typeof categoryTitles[number];

type sortDirectionType = typeof sortDirections[number];

const selectedSortType = ref<categoryTitleType>(categoryTitles[0]);
const selectedSortDirection = ref<sortDirectionType>(sortDirections[0]);

async function fetchCategories(
  sortType: categoryTitleType,
  sortDirection: sortDirectionType
) {
  try {
    const { data } = await api.get<IFetchedCategories>(
      `/categories?sortType=${sortType}&sortDirection=${sortDirection}`
    );
    return data;
  } catch (err) {
    isFetchError.value = true;
    console.error(err);
    return {
      categories: [],
      total: null,
    };
  }
}

async function sortCategories(categoryTitle: categoryTitleType) {
  try {
    isFetching.value = true;
    if (selectedSortType.value === categoryTitle) {
      selectedSortDirection.value =
        selectedSortDirection.value === "asc" ? "desc" : "asc";
    } else {
      selectedSortType.value = categoryTitle;
      selectedSortDirection.value === "desc";
    }
    const [res] = await Promise.all([
      fetchCategories(selectedSortType.value, selectedSortDirection.value),
      sleep(500),
    ]);
    categories.value = res.categories;
    categoryTotal.value = res?.total;
  } catch (err) {
    console.error(err);
  } finally {
    isFetching.value = false;
  }
}

onBeforeMount(async () => {
  const res = await fetchCategories("countView", "asc");
  categories.value = res.categories;
  categoryTotal.value = res?.total;
});
</script>
