#!/usr/bin/env bash
# Prints KEY=value lines describing one narrated part of the film (consumed via $GITHUB_ENV).
case "$1" in
  intro)
    echo "COMP=DronesIntro"
    echo "NAME=DronesIntro"
    echo "FRAMES=5322"
    echo "MIX=scripts/mix.mjs"
    echo "PREFIX="
    echo "CHUNKS=6"
    ;;
  part1)
    echo "COMP=Part1"
    echo "NAME=Part1_NewMath"
    echo "FRAMES=5064"
    echo "MIX=scripts/mix-p1.mjs"
    echo "PREFIX=p1-"
    echo "CHUNKS=6"
    ;;
  part2)
    echo "COMP=Part2"
    echo "NAME=Part2"
    echo "FRAMES=4548"
    echo "MIX=scripts/mix-p2.mjs"
    echo "PREFIX=p2-"
    echo "CHUNKS=6"
    ;;
  part3)
    echo "COMP=Part3"
    echo "NAME=Part3"
    echo "FRAMES=11610"
    echo "MIX=scripts/mix-p3.mjs"
    echo "PREFIX=p3-"
    echo "CHUNKS=12"
    ;;
  *)
    echo "unknown part $1" >&2
    exit 1
    ;;
esac
