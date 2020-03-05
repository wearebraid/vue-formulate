for file in ./src/locales/*
do
  filename="$(basename -- $file)"
  echo "building $filename"
  npx rollup --input "$file" --config build/rollup.locales.config.js --output.name "$filename"
done
