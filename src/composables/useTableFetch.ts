import { reactive } from "@vue/runtime-core";
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { usePagination } from "@/composables/usePagination";
import { debounce, handleError, updateQueryParams } from "@/utils";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";

export function useTableFetch<TD = any>(
  url: string,
  params = {},
  itself?: boolean
) {
  const loading = ref(false);
  const { showToast } = useCustomToast();
  const { t: $t } = useI18n();
  const route = useRoute();
  const router = useRouter();

  const defaultParams = {
    page: route.query.page ? +route.query.page : 1,
    limit: route.query.limit ? +route.query.limit : 12,
    search: route.query.search,
  };

  const paginationData = reactive({
    total: 0,
    defaultLimit: defaultParams.limit,
    currentPage: defaultParams.page,
  });

  const { offset, changePage } = usePagination(
    ref(paginationData.defaultLimit),
    ref(paginationData.currentPage)
  );
  const filter = reactive({
    category: route.query.category,
    type: route.query.type,
    status: route.query.status,
    date_gte: route.query.gte,
    date_lte: route.query.lte,
  });
  const searchText = ref(route.query.search);

  const tableData = ref<TD[]>([]);
  const fetchTableData = () => {
    loading.value = true;
    ApiService.query(url, {
      params: {
        ...route.query,
        search: searchText.value,
        page_size: paginationData.defaultLimit,
        page: paginationData.currentPage,
        ...params,
      },
    })
      .then((res: any) => {
        paginationData.total = res?.data?.count;
        tableData.value = itself ? res?.data : res?.data?.results;
      })
      .catch((err) => {
        if (err?.response?.status === 500) {
          showToast($t("server_error"), "error");
        }
        handleError(err?.response?.data);
      })
      .finally(() => (loading.value = false));
  };

  onBeforeMount(() => {
    const currentPage = Number(route.query.page);
    if (currentPage && +currentPage !== paginationData.currentPage) {
      onPageChange(+currentPage);
    } else {
      fetchTableData();
    }
  });

  async function onSearch(text: string) {
    offset.value = 0;
    await onPageChange(1);
    searchText.value = text;
    await updateQueryParams("search", text);
    await debounce("search-merchant-search", fetchTableData, 500);
  }

  async function onFilter(filterType: string, value: string) {
    await onPageChange(1);
    if (filterType === "date") {
      if (value?.split(" - ")?.[0] === value?.split(" - ")?.[1]) {
        filter.date_gte = value?.split(" - ")?.[0];
      } else {
        filter.date_gte = value?.split(" - ")?.[0];
        filter.date_lte = value?.split(" - ")?.[1];
      }
    } else {
      filter[filterType] = value;
    }
    debounce(filterType, fetchTableData, 500);
  }

  const onPageChange = async (page: number) => {
    if (page && page !== paginationData.currentPage) {
      await updateQueryParams("page", String(page));
      paginationData.currentPage = page;
      changePage(page);
      fetchTableData();
    }
  };

  const scrollToTop = () => {
    const tableEl = document.querySelector(".i-table");
    if (tableEl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onChangeLimit = async (newLimit: number) => {
    paginationData.defaultLimit = newLimit;
    paginationData.currentPage = 1;
    await onSearch(String(route.query.search || ""));
    scrollToTop();
    await router.replace({ query: { limit: newLimit } });
  };

  return {
    offset,
    loading,
    tableData,
    defaultParams,
    paginationData,
    onSearch,
    onFilter,
    onPageChange,
    onChangeLimit,
    fetchTableData,
  };
}
