#!/bin/bash

find . -name 50_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 100_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 150_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 200_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 250_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 300_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 350_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 400_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 450_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 500_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 700_result_$1.txt -exec cat {} + >> full_result_$1.txt 
find . -name 1000_result_$1.txt -exec cat {} + >> full_result_$1.txt 