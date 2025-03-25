<template>
  <div>
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      @input="onEditorInput"
    ></ckeditor>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Link } from "@ckeditor/ckeditor5-link";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { List } from "@ckeditor/ckeditor5-list";
import { UploadAdapter } from "@ckeditor/ckeditor5-adapter-ckfinder";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResizeEditing,
  ImageResizeHandles,
} from "@ckeditor/ckeditor5-image";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";

const emit = defineEmits<{
  (e: "editor", value: string): void;
}>();

const editor = ref(ClassicEditor);
const editorData = ref("");
const editorConfig = ref({
  plugins: [
    Base64UploadAdapter,
    Essentials,
    Bold,
    Italic,
    Link,
    Paragraph,
    Heading,
    List,
    BlockQuote,
    UploadAdapter,
    Autoformat,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResizeEditing,
    ImageResizeHandles,
    Table,
    TableToolbar,
    MediaEmbed,
  ],

  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "uploadImage",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
    ],
  },
});

const onEditorInput = (target: any) => {
  emit("editor", target);
};
</script>

<style>
.ck.ck-toolbar {
  background: #fcfcfc !important;
  border-top: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-right: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-left: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-radius: 4px 4px 0px 0px !important;
}
.ck .ck-editor__main .ck-content {
  padding: 16px !important;
  background: #f5f6f7 !important;
  border-bottom: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-right: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-left: 1px solid rgba(142, 155, 168, 0.2) !important;
  border-radius: 0 0 4px 4px !important;
}
</style>
