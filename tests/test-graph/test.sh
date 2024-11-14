#!/bin/bash

for i in {1..10}
do 
for j in {1..10}
do
node src/index.js $i $j 100 &
done
done
wait