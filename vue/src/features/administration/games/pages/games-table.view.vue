<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'
import moment from 'moment'

import { defaultOptions, sort, tableColumns } from '../schema/games.schema'
import { useGameAdminHandler } from '../handlers/games.handler'
import { parseQuery } from '@/core/utilities/parse-query.util'
import { GameDto } from '@/core/apis/dto/game.dto'
import { PaginationOptions, PaginationMeta, PaginationDto } from '@/core/apis/dto/pagination.dto'

import ContentLayout from '@/layouts/admin/components/admin-layout.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated.component.vue'
import ActionsComponent from '@/layouts/admin/components/actions.component.vue'

const $route = useRoute()

const { t } = useI18n()
const handler = useGameAdminHandler(t)

const loading = ref<boolean>(false)
const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))
const response = reactive<{ data: Array<GameDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await handler
    .getPaginated(payload)
    .then((res: PaginationDto<GameDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

function createGame(): void {
  handler.create((_: GameDto) => getPaginatedData(options.value))
}

await getPaginatedData(options.value)

watch(
  () => $route.query,
  async (newQuery: LocationQuery): Promise<void> => {
    const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
    await getPaginatedData(parsed)
  }
)
</script>

<template>
  <ContentLayout
    title="administration.games-and-software.games.title"
    subtitle="administration.games-and-software.games.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="
          t(
            'administration.games-and-software.games.caption',
            { showing: response.data.length },
            response.meta.itemCount
          )
        "
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" type="button" @click="createGame">
              <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
            </button>
          </div>
        </template>
        <template #user="{ row }">
          <div class="d-flex flex-row align-items-center gap-2">
            <img class="cover-icon" :src="row.cover" />
            <div class="d-flex flex-column">
              <small class="text-muted fst-italic">
                {{ row.id }}
              </small>
              <p class="fw-semibold text-light">
                {{ row.name }}
              </p>
            </div>
          </div>
        </template>
        <template #platforms="{ row }">
          <small class="fw-semibold text-muted">
            <template v-if="row.platforms.length"></template>
            <template v-else>-</template>
          </small>
        </template>
        <template #release="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.release_date).format('L') }}
          </small>
        </template>
        <template #actions="{ row }">
          <ActionsComponent :id="row.id" type="game" />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.cover-icon {
  height: 3rem;
  width: 2.3rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}
</style>
