#!/bin/bash

for i in {1..200}
do 
# echo "hi"
  node src/index.js &
done
wait