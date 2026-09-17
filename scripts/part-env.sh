#!/usr/bin/env bash
# Prints KEY=value lines describing one narrated part of the film (consumed via $GITHUB_ENV).
case "$1" in
  intro)
    echo "COMP=DronesIntro"
    echo "NAME=DronesIntro"
    echo "FRAMES=5322"
    echo "MIX=scripts/mix.mjs"
    echo "PREFIX="
    ;;
  part1)
    echo "COMP=Part1"
    echo "NAME=Part1_NewMath"
    echo "FRAMES=5064"
    echo "MIX=scripts/mix-p1.mjs"
    echo "PREFIX=p1-"
    ;;
  *)
    echo "unknown part $1" >&2
    exit 1
    ;;
esac
