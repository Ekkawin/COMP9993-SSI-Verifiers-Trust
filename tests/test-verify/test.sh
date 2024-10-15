#!/bin/bash

for i in {1..1000}
do 
# echo "hi"
  node src/index.js 1000 &
done
wait