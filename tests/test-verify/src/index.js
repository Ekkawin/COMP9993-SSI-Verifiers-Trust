"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from "express";
// import * as bodyParser from "body-parser";
// import {
//   compileRootHash,
//   compileHashAddresses,
//   generateMerkleProof,
//   makeMerkelRootFromProof,
// } from "../services";
// import { PrismaClient } from "@prisma/client";
// import crypto from "crypto";
// import { ethers } from "hardhat";
var axios_1 = require("axios");
// import data from '../data.json'
var fs = require("fs");
// const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var concurrency, good, bad, startTime, t, halfTime, requestId, u, endTime, stop_1, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    concurrency = Number(process.argv.slice(2)[0]);
                    good = 0;
                    bad = 0;
                    startTime = new Date();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post("http://4.240.54.55/verify-trustanchor/0x0B306BF915C4d645ff596e518fAf3F9669b97016")];
                case 2:
                    t = _b.sent();
                    halfTime = new Date();
                    requestId = Number((_a = t === null || t === void 0 ? void 0 : t.data) === null || _a === void 0 ? void 0 : _a.requestId);
                    return [4 /*yield*/, axios_1.default.post("http://4.237.160.211/verify/".concat(requestId), {
                            holderWallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                            issuerAddress: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
                            data: {
                                type: "Buffer",
                                data: [
                                    19, 211, 71, 226, 58, 39, 8, 198, 67, 181, 121, 94, 83, 51, 72, 36,
                                    63, 11, 244, 205, 127, 191, 44, 109, 11, 221, 2, 196, 27, 140, 37,
                                    109, 233, 5, 124, 181, 241, 126, 59, 105, 81, 197, 1, 51, 65, 151, 5,
                                    35, 111, 113, 160, 102, 5, 110, 34, 250, 211, 107, 211, 189, 126, 68,
                                    10, 151, 182, 29, 198, 148, 35, 168, 142, 15, 143, 13, 54, 50, 134,
                                    191, 253, 136, 173, 252, 4, 121, 62, 217, 132, 123, 16, 59, 105, 57,
                                    117, 194, 227, 51, 250, 189, 33, 106, 227, 214, 67, 64, 234, 191, 47,
                                    54, 182, 149, 72, 17, 135, 223, 137, 23, 166, 235, 54, 41, 139, 70,
                                    198, 248, 155, 69, 139, 168, 136, 9, 19, 98, 168, 41, 53, 6, 251, 193,
                                    90, 42, 67, 103, 229, 119, 111, 136, 130, 188, 197, 202, 88, 13, 184,
                                    118, 45, 96, 217, 30, 240, 181, 27, 122, 212, 145, 121, 16, 147, 39,
                                    111, 2, 47, 81, 125, 113, 193, 131, 236, 152, 239, 43, 140, 201, 55,
                                    199, 55, 216, 150, 76, 105, 224, 48, 193, 31, 76, 173, 103, 27, 40,
                                    214, 11, 231, 47, 255, 31, 73, 4, 136, 137, 28, 93, 91, 200, 250, 54,
                                    31, 13, 174, 96, 204, 21, 245, 168, 72, 37, 235, 116, 182, 123, 9, 0,
                                    228, 221, 185, 45, 13, 62, 145, 29, 123, 169, 72, 28, 40, 229, 193,
                                    146, 187, 49, 131, 247, 243, 102, 250, 126, 221, 212, 24, 16, 194, 92,
                                    22, 44, 62, 244, 142, 158, 137, 40, 228, 137, 190, 181, 209, 71, 168,
                                    149, 39, 56, 140, 53, 65, 47, 43, 229, 15, 126, 3, 80, 169, 42, 86,
                                    238, 144, 72, 156, 98, 206, 103, 39, 169, 234, 55, 133, 51, 49, 48, 4,
                                    99, 209, 255, 93, 211, 81, 222, 253, 177, 47, 94, 10, 15, 223, 48,
                                    169, 80, 14, 41, 161, 188, 67, 150, 56, 57, 139, 139, 170, 111, 158,
                                    89, 114, 236, 175, 81, 166, 82, 195, 26, 191, 224, 140, 120, 203, 196,
                                    69, 106, 39, 212, 175, 129, 254, 228, 100, 241, 213, 173, 170, 224,
                                    126, 134, 134, 70, 133, 63, 242, 149, 221, 77, 54, 105, 136, 18, 106,
                                    247, 182, 9, 116, 134, 169, 85, 139, 202, 62, 136, 220, 49, 249, 104,
                                    186, 90, 248, 134, 142, 143, 148, 140, 45, 245, 33, 167, 87, 138, 212,
                                    6, 179, 242, 70, 25, 119, 70, 208, 100, 156, 189, 76, 177, 221, 165,
                                    35, 238, 139, 255, 79, 25, 173, 199, 172, 167, 44, 132, 148, 211, 55,
                                    41, 74, 238, 59, 130, 90, 36, 20, 104, 212, 79, 90, 117, 255, 78, 96,
                                    234, 135, 13, 144, 158, 198, 4, 66, 121, 78, 12, 98, 92, 92, 74, 218,
                                    114, 219, 65, 90, 181, 74, 136, 45, 18, 128, 141, 44, 138, 86, 23, 89,
                                    243, 129, 66, 155, 198, 50, 231, 123, 238, 155, 25, 162, 99, 106, 38,
                                    124, 70, 226, 37, 104, 253, 192, 216,
                                ],
                            },
                        })];
                case 3:
                    u = _b.sent();
                    endTime = new Date();
                    stop_1 = new Date().getTime() - startTime.getTime();
                    // console.log("stop", stop);
                    fs.appendFileSync("./".concat(concurrency, "_result_1.txt"), "[".concat(concurrency, ", ").concat(halfTime.getTime() - startTime.getTime(), ", ").concat(endTime.getTime() - halfTime.getTime(), ", ").concat(stop_1, ", 1]\n"));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.log(error_1);
                    fs.appendFileSync("./".concat(concurrency, "_result_1.txt"), "[".concat(concurrency, ", ").concat(0, ", 0, 0, 0]\n"));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
