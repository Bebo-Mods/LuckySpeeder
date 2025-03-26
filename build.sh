#!/bin/bash

set -e

OUTPUT_DIR="out"

echo "Building for arm64-apple-ios ..."
clang=$(xcrun --sdk iphoneos -f clang)
sdk_dir=$(xcrun --sdk iphoneos --show-sdk-path)
out_dir=$OUTPUT_DIR/$target
mkdir -p $out_dir

$clang -dynamiclib \
    -x objective-c \
    -target arm64-apple-ios13.1 \
    -isysroot $sdk_dir \
    -F. \
    -framework CydiaSubstrate \
    -framework Foundation \
    -framework UIKit \
    -o $out_dir/LuckySpeeder.dylib LuckySpeeder.m LuckySpeeder.c fishhook.c \
    -Ofast \
    -flto
strip -x $out_dir/LuckySpeeder.dylib

echo "Build completed!"
