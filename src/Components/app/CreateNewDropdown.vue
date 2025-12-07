<template>
    <Menu as="div" class="relative w-full">
        <MenuButton
            class="inline-flex w-full flex justify-center border-2 rounded-md bg-black-800 px-4 py-2 text-sm font-medium text-black hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
            Create New
            <ChevronDownIcon
                class="-mr-1 ml-2 h-5 w-5 text-black hover:bg-indigo-200"
                aria-hidden="true"
            />
        </MenuButton>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                class="absolute left-4 mt-2 w-40 p-3 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
                <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                        <button
                            @click="showCreateFolderModal"
                            class="text-gray-700 block px-2 py-2 text-sm"
                            >New Folder</button
                        >
                    </MenuItem>
                </div>
                <div class="px-1 py-1 flex flex-col">
                    <FileUploadMenuItem/>
                    <FolderUploadMenuItem/>
                </div>
            </MenuItems>
        </transition>
    </Menu>
    <CreateFolderModal v-model="createFolderModal" />
</template>
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import CreateFolderModal from "./CreateFolderModal.vue";
import FolderUploadMenuItem from "./FolderUploadMenuItem.vue";
import FileUploadMenuItem from "./FileUploadMenuItem.vue";
import { ref } from "vue";

let createFolderModal = ref(false)

const showCreateFolderModal = () => {
    createFolderModal.value = true
};
</script>
