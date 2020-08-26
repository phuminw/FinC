#!/usr/bin/env bash

mongo FinC --eval "db.createUser({user:'finc',pwd:'82fvs1dk',roles:[{role:'readWrite',db:'FinC'}]})"
