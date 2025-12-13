#!/usr/bin/env node
import { runCLI } from './src/core/cli.command.js';

const args = process.argv.slice(2);
runCLI(args);
