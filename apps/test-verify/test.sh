#!/bin/bash

for i in {1..300}
do 
# echo "hi"
  node src/index.js &
done
wait