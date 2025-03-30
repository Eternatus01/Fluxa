<script setup lang="ts">
import Avatar from '@/shared/ui/atoms/Avatar.vue';
import TimeAgo from '@/shared/ui/atoms/TimeAgo.vue';
import DeleteButton from '@/shared/ui/atoms/DeleteButton.vue';

defineProps<{
    username: string | null;
    avatarUrl: string;
    createdAt: string;
    canDelete: boolean;
}>();

const emit = defineEmits<{
    (e: 'delete'): void;
}>();
</script>

<template>
    <div class="flex justify-between">
        <div class="flex items-center space-x-4">
            <Avatar :src="avatarUrl" />
            <div>
                <span class="font-semibold mr-2">@{{ username }}</span>
                <TimeAgo class="text-gray-300 text-sm" :date="createdAt" />
            </div>
        </div>
        <DeleteButton v-if="canDelete" @click="$emit('delete')" />
    </div>
</template>