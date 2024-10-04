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
        var good, bad, startTime, t, halfTime, requestId, u, endTime, stop_1, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    good = 0;
                    bad = 0;
                    startTime = new Date();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/verify-trustanchor/0xe8D2A1E88c91DCd5433208d4152Cc4F399a7e91d")];
                case 2:
                    t = _b.sent();
                    halfTime = new Date();
                    requestId = Number((_a = t === null || t === void 0 ? void 0 : t.data) === null || _a === void 0 ? void 0 : _a.requestid);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3001/verify/".concat(requestId), {
                            holderWallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                            issuerAddress: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
                            data: {
                                type: "Buffer",
                                data: [
                                    135, 1, 209, 7, 6, 238, 72, 169, 185, 217, 12, 184, 179, 60, 18, 173,
                                    147, 72, 46, 238, 99, 80, 147, 62, 41, 139, 34, 190, 215, 75, 61, 201,
                                    64, 214, 204, 44, 91, 211, 204, 241, 136, 220, 119, 79, 19, 150, 93,
                                    49, 193, 190, 43, 11, 217, 115, 138, 5, 124, 227, 114, 72, 214, 92,
                                    37, 62, 219, 215, 166, 183, 79, 193, 174, 166, 132, 34, 44, 218, 146,
                                    225, 82, 142, 180, 212, 130, 134, 46, 227, 89, 27, 129, 59, 20, 8,
                                    178, 14, 238, 40, 4, 71, 153, 58, 21, 85, 198, 146, 147, 181, 162, 36,
                                    27, 96, 161, 44, 50, 219, 71, 40, 232, 122, 97, 181, 85, 178, 225, 20,
                                    250, 107, 55, 243, 89, 62, 63, 122, 200, 102, 111, 187, 126, 93, 213,
                                    18, 94, 19, 9, 66, 244, 197, 7, 159, 13, 101, 31, 253, 62, 132, 181,
                                    84, 197, 52, 83, 136, 199, 139, 1, 12, 76, 45, 194, 77, 220, 185, 83,
                                    216, 174, 89, 3, 219, 237, 212, 112, 144, 79, 103, 32, 225, 228, 136,
                                    41, 21, 190, 78, 160, 151, 207, 44, 147, 209, 79, 163, 145, 152, 129,
                                    64, 89, 211, 63, 6, 243, 138, 224, 44, 45, 62, 160, 221, 215, 160, 36,
                                    87, 31, 25, 207, 46, 49, 3, 158, 189, 234, 65, 77, 56, 154, 125, 109,
                                    7, 49, 227, 145, 200, 15, 88, 96, 145, 111, 11, 34, 19, 229, 240, 177,
                                    185, 127, 94, 99, 23, 225, 107, 20, 143, 82, 177, 120, 4, 91, 16, 156,
                                    98, 103, 218, 159, 237, 41, 226, 169, 227, 21, 50, 28, 91, 161, 86,
                                    145, 126, 18, 49, 136, 6, 62, 210, 65, 208, 211, 173, 31, 177, 2, 202,
                                    213, 120, 44, 74, 113, 197, 40, 133, 26, 42, 180, 55, 166, 249, 34,
                                    29, 26, 68, 89, 21, 184, 219, 74, 95, 67, 92, 90, 137, 79, 77, 75, 95,
                                    44, 194, 37, 63, 183, 132, 56, 112, 192, 113, 147, 104, 208, 166, 195,
                                    25, 253, 41, 141, 146, 92, 109, 235, 236, 230, 62, 163, 124, 103, 56,
                                    144, 74, 46, 239, 62, 35, 80, 180, 114, 146, 221, 237, 25, 236, 44,
                                    135, 171, 49, 244, 143, 151, 32, 95, 151, 247, 231, 16, 16, 168, 63,
                                    200, 45, 16, 177, 83, 20, 247, 182, 221, 100, 35, 163, 188, 101, 84,
                                    225, 237, 81, 71, 198, 207, 8, 211, 124, 138, 0, 228, 5, 80, 82, 92,
                                    159, 167, 141, 176, 242, 144, 82, 249, 20, 208, 74, 83, 85, 134, 168,
                                    67, 148, 25, 91, 18, 222, 115, 175, 133, 229, 244, 70, 209, 214, 70,
                                    223, 251, 46, 38, 128, 210, 64, 149, 81, 254, 230, 39, 206, 212, 238,
                                    82, 94, 160, 81, 9, 46, 220, 226, 78, 76, 88, 73, 52, 56, 182, 22,
                                    107, 67, 217, 60, 27, 53, 151, 69, 77, 47, 233, 134, 255, 41, 26, 120,
                                    22, 76, 67, 160, 20, 55, 143, 34, 188, 24, 209, 209, 133, 23, 132,
                                    255,
                                ],
                            },
                        })];
                case 3:
                    u = _b.sent();
                    endTime = new Date();
                    stop_1 = new Date().getTime() - startTime.getTime();
                    console.log("stop", stop_1);
                    fs.appendFileSync("./result.txt", "[".concat(200, ", ").concat(halfTime.getTime() - startTime.getTime(), ", ").concat(endTime.getTime() - halfTime.getTime(), ", ").concat(stop_1, ", 1]\n"));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.log(error_1);
                    fs.appendFileSync("./result.txt", "[".concat(200, ", ").concat(0, ", 0, 0, 0]\n"));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
