//Credit: github networkmaster
import { BB } from "./BB.js"
import LZ from "./runlengthMatch.js"
import { inflate, deflate } from "./pakoMinified.js"
import { decodeSafe, encodeSafe } from "./runlength.js"

//compressed json. (dictionaryBIG.json)
let wordDict = (() => { let r = new BB(); r.F("4xZLduomrqCDF-BrPNWlqsrKe4S7480fW_rMf79kFqIy1QSIQnmqLfmqvfM9cae0A2LnJwzlypwnpbRXKHJuaZM3FsVqimXIi59cnoszFnl6x0uCUUCDsnbbgVetyHiTdqljA5l1ExqWmMMuIWt5yJX2SnzEtW-sv5Al6Tgedy5i2wfjx5y0JXPaJyW3NVOmnmzTALpj8sCMnIOzzKTHB2nyHglRcdNtkdAlMCSdXPMvlTkZ17JivTZ_ubc06Op_vRuyNqppVjlnTkS17d_8e-jrim7UtN3rJnD7DqpmHxzGuCeeQSv40ZZ6wlrlJqWWU-eZcQg8svOSml0_Nm8Ltli61l_NFF2l_VynAKjK4IX5DucUOdjyS5Jxuc1z0S7EtmOdcG7c1nJ3Cs8JV9l5GFglPlZ_FTqgSB81rpcFIXPA2dG81rCNPveVLkZeVnoK8VNPr2l1JyZu1fVNzqCYNTHo1c3J96ZJqcXLn8w6UNPxbUT6pbJ6vk3PcxMfs7aicV9goglrL1yF4rJaYy198pxD9SgXu_Yu22yOe986G3oRe4fTqwsPRZZXjKKkE7PznFAaB2n3SH3guD9urd2fx_FuOx9WTqfuw8UD6zMUah3zHuIt72q93TRebfnxZ7KOLA_VDvvP8XXdEmmB9IjYE6ep8S0rJqP3v2MNSrOZ1edkbkbHH5Ty2HKJHVwfVkOeygljn5o1_QDCbMi54prDVV7C0-2Nde0YoYE-Rmq6D6DRkPTxLVSPNULwE5IGTdclqun8x1e-1N4IaePG7JigHqpimKWTEQtzHg73tcjA15tbwehKc1bs5xQnzbBkdPgT1eTnrz08Sh0_MG0fqyrrDOXT7Q3pMfuWJtWHeUwZ2MsOfTp78M9DUl_n9leI6pGGxXpoYybqeE_Qp-sI-SkgtvG6BXize68kHrny3un_vBJmYocz1foP45P5Ej7VHRF1rJ6CdN1p0qatub2vIzctRaeVWpj_VZvsSU0oDyvX6FpkddloT71VczI_edVd_zLNkrw1Vao1o9-AG3w2gKJxMd7kvRFmlAqQdDGPO4XWXGupFGEiuSJquez3TVxQPmoNseMvZuB1jipXwUtSrXV1fQdjetSjCYi-X1qHOUrlvi2CuQ1GZ4aP9yMn0oUH1-3CTY1eSnBllazuvazFy2m60yVbaWibQI0a1enUa3uSkWNNeZ3YuCnoWT_PCQHTFuZQNPO1ai9sgeK6o16bUW03f4Pdv65Cbdz-udvz4N187Of9N1ZX3uvDvgeZfHKPomd8qlZPHQXdgeD4yT3V_d1f_M5HGz6NeOqKfq5h942xyU8yDP71YN4JOWNP_B8gG1iBy9KbM6eszoXua8e9xhSnPmzoEFITH_PTd6P9Jp2Ijx44P5p4ryMALFQqN-Oxn-707EUY6_N1KUh999fXfmPXFQ_qf09_JT5_HGj_r4fqc3v5DlxESP_nSUB9Zeyc5KpFT4t0uy0Kw7NNanA-5zqIp22nTSQCR1UPAMYX01Jfz1r8FokT51Lhvp3tEzxzt9Em4n-6lEfg99aR5NF4w3tQl_TxVsUEcq_BsEJ9pJr-jq5U7OFO_nj57T4E9EWK-uiHAlkz2Wibrhh_CWfmmHOQ6VpQMqeuRhZLByTkOTkdnP0oM_szbqXVAFFxQ-JjjoQ3oXtgElECs9aYU9leyQA_U1TPC4cICXJa3FD-I3l4x_WKvVxNRVGwBkTVjCynPpUQcEFqusAjOXNPxQchvpRKNTXhnplnDexlo-Nt0Yi1np0Lel0Gj_F6ZDF2-O9DozViBAlGVD5X51YZx3WNxkxWp-KtWHuXQSM29T3U_V60ks4CCynGK7AZH3dLdnw9NJxgwyJZyjoAopZgmeRnw0ZelvjaIVVmCUZqMBUXlEPLanStUyvUDGCCuKvNSc6UZa2SC-mcV2fDtem-O5y23c0RMdzU9Pl4DJAm7Vyalug6mj889svpkHk8c-lGTqKp86q_a5VNLM5z8apTP-863Mxj8T-d-MLYf_lrNyamWiyp_2K9KQLHZnixkOCPpXU28NeqBVL-pVKvSkrZXOksUbLUCzNksFEGuCYSQBibnguHrk_l-tPeurx1KzSgFfJswFc6-ritppdkGW4v8qipxboOia2eNV-TLG4TJg1FUq-2_bQpUR5Xo_-r73uXm6-FLPhM_O-sl1VHZVz7LLXxlaagDQ3pYv8ddoWu9xzn-x0rr4bk-HF89xrXxDiaTJCHEyI6pFVY8QSyC6BlnSSPAJ65CYHGxPLLp1JAYHL42z59USBQaI5KQa4nFH19FN_Ixih-ljnuIWErqfJFO9Fpoupc-CVVE6R4lz2UGYwzKrZeUhvThqcxPaPpuMa6jfgqijzjiSFSxzW_s4aniT-G1MluZGSAx3mXwiJJo7Y2H7Mv4zyI6qzcou7XZEMJLj6TqRVXCL6k0b0cFKf3d8_x0bNfPR-erU0HRzOmQoSFYFi6bnAPeGoHLLVPbQ7wnqO9xPJS1q6XpvZNF8DleG_aovVj7bd4E-1tjaaHep8z_uSTcLKaRI4AC5YJak7CLe5mRmU01ZjiU7cPTgc8xFXC-IlT_RNHSV5S_Nki3Ad-rIfxT1zjEbM_2wyyN0V-Q03D4PuIj9nQYgpq0PYqyx-biuqd6w2cc4xajjLu7p5rOOX1EffJAz2LwccGlbPCcgIhAifPgH0IBthbwouPdBc6xzjqvgpyApTh0ugZqGMHENGDLJrA--dPl6g-Nkm99A6OXwLf7bcHJ-vaM99-kyo3X0wKVUmgbsQECAUFxZ00mHugcMgOKqiimIFQf0HzR8zVC-vyOXI2Q0krAzInmwEdUJgEoGAWCg-hla2v19VjHeIG7AXOKIP7MScYYhU9M-8nn5nxDL-yOzLI8zkfPNNggrQIPFQ6HTkvaDnHvsmCzSI-Dn0egzMiy76DxJYGJLG-ZrkvUX2yA8M_xJlFI3Bq8FqN6LLsXik6Dpfz6GIcTCRLAthntwydf7uzNthTRlFLrguZENZXLOt7nqzhgvSvXha8f1fDlB-OREGW8yZJ_5ufhPpD344xezJJCnmqjx58UN59TmCWB2PiAW4XpOAyWsQA4xOrWCUHUYy6erAdkxSaTSzpmrmmX1b8qUU-fT9NguimBh2MiuDnYhShmivNqvIogY6Cv8naDx2uBb-pK3IpPugy02NCs4ORSMQHF0UlaNVVRhaTTefO8r9xVOuCfjJ95icismEk1PSjyhegMqClspiedoxrEoynN72WLd18G9RpT3WJKMIbio7ur6W5gXocdRiVq0vdr8dxFrqn7feTse4pBrHhrQOO898XFlTEt7sUmBdPwkbKNyIs2cWzqjIAzKjcwzkqyHUYyXuziEngU2zbzd7qf3OYG2zCd-y1xZUkOMjnoOToEfFaFzNIkBB7TWYDhfyOt3prmkf4ccB-qD9wWhSBYeCBa2WRNDjdbkhZr-goRXN1TkKk9sU9WNCSii3BygH39fvECfoAoTpg-m7-KuGwAYHlzF9rKWSYCL9vCEzUrA0aIZIeTUH_lSwZ8xsnEZGJJojTILzc5Ji-L4JMNFSba5530TBzz3_A82SXoAF3HrwY6SqSnhiYICsilmmlIGVXqLbYqsZmniPCjIKqW2tol9_gUDuwMlWLxQJpiLC9Js4njGmSLAp1Ld5lIKuXoULg6hyxr4T4xolD3bQ9FnO9DrmxT5kBtg2C0zWQG-Snr2Moz0_01Gn_LykSCnIiSCCyEnWFehq3njnkpwl7ybLzzsH7re_O2MGQC8IVndgTfTNIA5UUgrS1fMJ9q_IV3CjxCoaudkMThS7y91kwUx32TkNXGekA2IzJ74Kurm_wX2c-3d9Ko-8OJx3nOn8d3cnL3oc5cdyDHloPe4oqqCgu0YJNRO9N8HSy74-fIxDUP1iE7hUQK3ZAjIIQ6ZIa0TX1v2cyzICE1YIsDFXJnT2zrJmKr--Y0OB9opQC78GqYhRsVlMdhwysiYJ9E2aSsOCMoPtk5hoMmzOBGJTzNn9HWUOheIqN1roqCvef5676dMiY8URTsokK7CG2SnzhOjzInERhxyKhdHRJaU0wO2vqUBM210qOl2tpvnxEqQH7w9ZcazZMPuil5QBmx4HCzclqvpfvkiFyLYgL5iS-R1gPjkFyskH1ezX-BabzztMoDtGyXY4xojVPARtOBBTMLbkfMyCF6COfvHawNfbmT3XxYDsg7ykFacBzyvIeALaCQxEVAreRmANu8ABhEw0GL2EJLYeVqvWms1gWm8YENJ2bLBnC4plXwGmLSCBR6TYDCCEK0vMNkox-tUv-I2fXc-5GRufTgF6FSgdLH9iEIfB6vEPpCfkSJs3OwJk-2TiUyCCIoyEkCpBQgqaWSW0FBJrLtCom9CvtqWFZHFvFWqRawgBy7aswccHzyZJ5XOdRzwSyqcJQyaYMybv2j3Qc0Oc0fVnGG97Mcc9aYskYOsl0_EDEHT4UIqU7zpALPAFh9-E0xfZZ1fU0DsBmgE2imAZnwHFGqTghLSnMKSQYNbFoFfzTbIVhchN9sgkTyrsLqX7F_sCmfTo7HJsvBd4UBVsAe6LS7xba74uIWGoaEB04HXQaZnnav7iBgwyfVVtLEwSYv6vZnJ3Ekcype38QJP4gI_Jt732MiEUcS81L3zSe6p57qAs8RJCoZiHOgX5EhurbmR7i2jMpSMuc2rNxSO5--ZxfaJbV5Xy2kKCs03CPdFZOm7RDnSHSWGhKinEx9hTJx1ADToAHOZOugLA2rh32WGUQpNRhMrOgOVUlvRP3iA_pas8L8uN0jiEvJdQElBygRn2cb16LqAbUbRgDnnbXRX1czLzqQJt-ivRPGn7WOJUlv5nSNun1ecJ_rmmYpMHL2rC82GgUB8ItiX-SlqFMBnoKrh1UIGrb2wJKwhXwhFJ2g4l3IwOkrNKBqMHQqFxiJXcSe6mliUClvc5oh9lUA-u13EUSCISjypqMdOo1Y20FNlrzEjnkSiJEy9sIZu6I3lCQHhCiWuw0mMwsyaOCov_qv-v8dlOP3gt_u-7j_4ZpJOdUd3B1pysarsWeiyYfNF5bofsiOKQwVriQH07FLXIcYGfeZbWQ_fiKzY5PrE2WkMp5I6QVv_ihRXGPzoJ6CilbmrjVmVYZoJlW08fYfTCcZxIXk-9YxqlhalG6T_jgaYZ_FW2gFrAOFFNbD6Ou4R8jPkJlEJiD7Xnifz2gBL3nWBrl72uXZMWH8KU9QsUsyvg7QOwe2CPdMqXbYk7ELAky4CbbSOYhiVjoYyS6Zzr26exEUg7HYxZVpke-U_hOdJpriII3pyJJEMXd6SzhtLFeyKImmVndedauEDeanE8C2JI7j6TB3e6wl4b6vxrX5VDImaaV8WWBuQTGCgBNUcl21iJu_q7RPk0uFNPtjIOJLscyZQVRbO9MsLtHatK8abKC8xCQIWqrROUD6M9nM3limE0KtrKVsXtztivopSuKnGsEfeaD1VSzXIBq6Og4Zz0HxVetFEkcvxEyXdAggHCwkaCFnepnpmkZt68nGYmCs5Zl08O_LDNKYHxyYmY1fpUcoilzvHMrSy3p8NwOxbwfe2g0pNjB6g5v0p1dCs4KvTLqHYIUnmzKN9p4AWtJhILOITBmOZd6FtuyqtkO9SCJgZrFUtFhUgx-LBbRDyZWcqE8vCvLmQWgNFUC3bJCUtzLIMrprEAvMYwaZUVgzJ_97xyDpAoCtDkjHU_7j1_GZmP_1EK9Sia1zP8d-9WaOw0yQCfZRB86kLU9Zo38VuhqcJsO0lyOXlZT_RPzLzLpnkz7s8zD1ai40JP7iah49YxYXAoq0TPoJwnI30mdn-GSmLow6tpcQzSEoO8tmYnJqdVHx52tiiLD9j0Ygj_uOWsXFYwMvJ0tXMrTYX4UEwqMIEBXTjYQ7QMH8nTtlvnA0X8DTaZBCca_ZKqt-4ukfQIkETh58DGIQCJ8mgFEdK9Drhqo7eg5P4ZCcXs4U3BSVK9_8n9dUgcc_YA1PS4w4amSL9Ty-rjwD_WST6sv_Gr2KY-Z2I6_JWj-j5OU_UErWAeFft5Y8zlbJ-BfAAwdW-Rsa0cjC9ohfCxxS_41JWgUklI3dT1Pqy-R6OWAQhr2KIKwOim_KEj4FOf1Mww2w8ldUKAxlRzXpAxM9el3FRaExFL-dz2rUehGEqnEO_DPL3J5fzDYNVB2ZWIhNuJrRjf9j4Le6ZVFimtCmN1eszLMjzLcoiG3EburCjCc4vX1rnwrpQdpXsMmAIbmoblDgMC-9yW6_10YORGBva6FMMoR910PPepefEBmci60XMLDUbW1XJkydHkVQH7jo_YAugFrW2Lmm4lzdJ1OSSZ1UeBnZRRCQfpEJXU6V-6v0syz_bp_VAMctge2Jf19nfxYoPO2Y4HR1s_vSDIw56VGveQwTfRMzyrMa6y1oFBJe2rNwrs6ug4oKANYZGuKY1F1ML6Gfy8Ofp8ufj9sVWRBscFCdLOSmRJxFts1K8VIqLLv0XWPGbeGRo6UiqSZg2f_hlkn-T6FC7V-HG69SSE941_wlxkSUYWDBrQ0YYRf7boRRiKBn99u-nbCiO22MfngsSJCYeBBfjG29UicsuYjUSjCd7oNnyrQhTBH0fLKqaWWIVufZyUng2-oCcjIrNI0eT8jFi7GRexzv9a3zF_iFEEKtd7SyNxE-FG2DaxOOiCgxfF02iXs7bSEvvsOLKw3N3ZrwnqgzaKN5ZaxXSeEvMuikZCOhv3ZpyVAWHnXY1MuicTJcJTM3oZRIpas0aCfSO0y9zCtP7hClq6Yb09hkA3BDiSVfhTQUv4FSf_2vXfcacQusaJ2eh04EJLerAH-My7_sZfoRBkCg8UNp1LLnwLc4F3jW5wozJ6cSPaEEBmH1pIJxECc7EGCbhAWObh5_eumIFIEPSBabsyCv8oO7HqAwP9lXFP6JZza5b0ciHLa9rq1F6VFL9K6uzHqqN7HyCnKK8Croiho_6EbMbrfqArUhVZxxfNkGlIhmGIM7aMJISmGlx-ewfZIxu84DXJp6W3vTSwT7_4US--Sd6MH1RlnoZWpBc4FnVQnVU4BmeY39NCLJIgu6jgdzo7bFM9GU8WnMPDlVn-hr2t1mW9qpWBTicua9JWnu0f2NGWt7iBgUPrTe4wKGIaGwNirI7vB90ijckKtEFDhxwRFoYepr2_qIB6YRCeinAYdC7oLq_waU_uTW06dd67bR-1LP1ailF7HhzvLimUr5KLvrSCERXTtumOa2bbWTRNswMZGJZnvJrvlghzPpQpChHJctCN85Zm3Rs8wSBD_O9J6CumuRcr1twVZW3UWSZiNXO2YowamFwdVjqUntV1a7u2KgrCZhc52HHwpaNXZhLBX8Trew8Kedhokm5fPKQtnOoJ_npfpQfxBmTZNc9pVb4LLewNwAL0TAM7m-2iNjoetDFq6o98TIL8S5DU0RINo7xIj1dcoYRL8msifrwfcKC8xpq6Tuurvkf5hJYUcixtk9imCxxTllzJbxUhNflevT8jo1C-RLAKrvWe6GdYEKOxr4LEuCpsjhbki8LldVoYGJRS3Q5bX8qNtCXNoaMHxqZW_CvoPEctUPbW2G1eoauD_p-wM3rM2eF7vTyIGVeIoCsYxSXpZSDtJQmSnkXXK--I0gaFLJAtdBtH1x1YVOXx_gWrWLXm8lPT6YPbU1CiZlXkpVbqzVy6QPYUvXxSR8yxuCDLSDs1AYZ2jhrl1VDHu8ULYthVsEPU37sicbrYGCSbVUHkRHPhEe23qtIso43ACOdSej28PWHur3QyULqbX0cfRfuh5fLA_LUqdt7phVA9BkOdFo2aeCD_Sfdc2OQ2SJnCLqogxD8uRC25vwW9r3H83JzatejaRr3_ZUDFo8YbCRx3ET1m6MtNtanBebK_eAtKJ5Fur2zFwXQyPjbuzI5NMmoaOwxR9beQXPBHxVt4unL2woo_gXDntJEYYbyueyGci4e1FLl0GuJLq8sBTxICXsu7bYIEofg79GuzqkGSIeo-mXZdud01RIL3tU6IKSeBS2wJNFl1ERdXUgvoMx2kZMIItf6S3vSJtH4icsGWbIQ8GQFN7E679hgM3aFE-TbYClNJ5hCw-J4QBSLO3kWjlZfLm8VwJDOEWNvhNJWqdAfsbSB6h_y7Xxrf4-3bUVjlAYe6N7R1bhlIEgHTgujN-KqfOz9oA4T6Co-LFGUi9EhVKdTK7hd92yT4NIoYWb2BmnVvbWgd4YtlZfWAkM77NVECEZNp4nD6esQ_bM8bzr_1G8CZ_Eo_uUxKjrqTM8kVblJcvqNWwo4yfEB5cFVxWF5EhTYcShrrwHbj1QWUx1lMBrrKvr6IiBAUgoTXZnH6luZjRnbsWqwoWBsTnjR2uXE7DF4NE6EqOgOHVe_FLouhkhrUZX04PRq-TeFdxEPyfp6rQHWeLPJ-Wx2MYDju42Jx602In53c_5SPxVS2ESMWbT1oU-uwVfzdmEeTMW0fzSMCBi7lAKJDxTWKOTyGL93G8GkUSCzLu2XSTTbo4VYpl2G23-3iVWdb4JJ3ss1iqs7ohz7CuB5N3vZvMa7W8wPpr_N7LJBLe9g2uxh33uVjHF77LH3L378-6sgltYLSY_QOPnE_jVheR6yoGcW61SvpHejHhfJoAhAEqQIJezWbtsmoCbUlXu3RapMzj-wr0QCAx5lqa4_xoMm0aEMEmLTLvKj5jnseGCGQjO-s2DY4fhxSuoAIiumBH_3BUq5CsXCs49YhCYzMIc4l7IfiQUso5O5gHjIhxqUAbgEh0_TwwrIHLHJvzfLlmCoqbypnprOUpvrKQnorPgGCXAz_9FjtSkQf36Es5YwWjbuSl3pYHTCb2Ag2iL8-s4X5TWfNAkJLf-2GSIfCn785RknOLe9tVgB2PUBuGcJLMKZiGLiuAMJjAaTIPr5B_LwV8NUJbEBwODZ2OIGS1I_-n5wUg6AeA5z_MelCE7rFFwN3n2mVZN-kvsYvSHDGYkrv90vZxjzeEaGfrzpaDvyQwfNytSHzJiu2i2Zb0ok-Ai7XzC8c_4fhAMwbT1W_DbA9vJvuNC004CsDK-PcAesEw_mOtVy_HeT2pgGWDW440uq6_Q87MP4L_hnnK82O81_mkK-_TTwUwZ_UgzmolLxRkLZpc-H-RNg5r9P1Kp_6WNh_hRgILnf9C6KTj_v85Pi09iB8Pm24fhT8-PvFY-HVj_TcN5hWoo_VCpI-HbevHYhX9n1BXIGtXpw4pdSJFA1CFNb3RQBKisyfW2h_NYs9_G673GCfnYAy_wxd-nmC2ie8PchSi6JJc1BJryWHkix4jU0Q5r3TPLPF1BPlKRaw_bJzAFg3soJieP9W0f5JIWoIXWp73pV9nNKybacz8sa4rYKgk39kIpunOGqvgmwTz2EOvgCgHgB6dsgwQVIF4Lmj592078j3U18ObDOIg6w3iBE1gCj5jUguIaCClFx_rfz-MQMzezI4de_zVcdYhN4r_OXacXxm5N9RpUxAg3ZbLn35v6DLNEkCpvPnUpl8wp6G--M_yUv8ev1IY7_4KwXRCvT7t0UQVbjDsA-j9pn8nqB2Z3oK6cMQAfPXFmd2GnJffEF233KsvP5ysgb2AD7svSUtiQkTbnFv-PTnh_ieGJp6CYls4ZnSed_CSndmhG3anv3p9wNh3R6dxCjLxKmZd5F6oW_MZ4W9zlmaTSTIwW5BDz5e_tdu2ZxsPN2Zg4OWGBqkHlkDv11ZtPkAfSnRh6DSZsP9l54FQ-57tfyPT2yE7qbHCAJka4dcXIpbof700LYkKEbtubbwsj3Ouz67BlE3OUN5BxlEuw7I5IvtNRD-fH01pZDYCGBWtAhY3cBmX3eK3iEQKDLxI2RMTYZtHv05anP3Z2uYzOz2qCVwgR4laX52mlLGF0Zi-GbjNC091oyzO-6trtSf4R_4Jy3zTmR0OWbl8c-ZFdbxxQZGRh0BWanOE5FO2AX9SVQ51_6hkDvgZP_27mydxoZWUU8ZnNmB-oNRTTuel5tPdKeqBoSundmES933dJIjzGxaBauW74HPct0p076BiB86dOUqw63vHGTaPcHd7jJ8YrSgUBWsZ2L2I_CeBhVpFzfupYj0qIOqCU8-xUBMfavbVdeSjDhz_OmnkIuqB_iqSXhMjjLrfJ90ZnLxcZeL3Ihd8IY20FkwlIdvYb0Qupu4tqLLHI3_vvWw3XoECEvqECiiHzwgNH2B-6pG3L32Y_7YQOi0gdrpoqybEbWsdxD_Lb83dpZ6kkNfPWnRvFaRHm9x5EXiwPeRQ2H_A_89b8nXBHX6B3YtKpQO7OrMB2Yk5BcWEdR_ZvdR460vxjwETTgIUjAnAsMkiig2HTSlA8IyjJkjEgNFMIOaE-Ohdp5jp_F-PhCUsGKHMFxB7n5MpmdjZB70kfErDmAv7jOwIF7PY5hZEKeZEWgjApxn4OrktP9MGCzzD_enmdvwd-gnx67qAesG7i9KfbvbaPmu87WZla4h1nx1qK9IyF1V_RrRVT9tL_SvDDl4lq2S3HomsTUJIprrrMA-A_V3fyGz1dwGfjsXzvbzLK-h3NnC6TLFjzbM_Nyo59ywB7yrDYr6bG7a_DWZooa9Ty76jjpfyHaw1x0Nb3XBkaiDpmKCH0COlCNnLhhR3PSsAj0MxmoiBVH2dz4JLsT_OSJ7mcHix4TOuBOS7eDITgdn07sK9C4ddvUBEvDEsTsbwgQw1xJ65QE_a1Yt1VAq_sUziS3Khif9BrprfUfyaioAJXkU7Fxx2i9ILJ_UmJzhdgis0PVTEKA9UFcaV_VgYvIrAVcfahNfVHblqewFu4mNv8BvBvrNZGJpU1XEfmKcwqRaWZlduwcAPyHOncUakT00t8Cn2IEIVKWFyeglbnRO_vAhcQH29HZnxTlbuOhCbCREtjcLkeC_qjKzcjdAILgpmczu9gjcr7xWSgY0C8wR5HPH3xZKsrzR5pjbZ2baCCsNB17C1DcrBu5CCDKY44uSBAN_dSVY--UjA0grRezENJMwFXBn-jineRAtJlzYwk36qiGm8k8DSuj0ZusWOjKmCa9K64v0o4dtxhHnV4TgDuf4176Z9Jhs3vye9feuAeF83wIAkxrdzMlmFXD00MTdiIGa-wbGsdHI7Fd_gdZmv25uuj64P2ZIuOUXAGdvbWPwglHiv9NUxV-Y86FReYR_PGsCmHeHOB0zX85GSoBqk9pFCvfllk9Y0clxwOuugNv5rUgY04w7fLB4IHC9eQ8w9ZYtTmiAuec4zzjj7yFMa1cAwp_O22fH3_5hDaU5WR0MBhN0p33A43LWW-zJWSHJrrYo-g2R7WAnsd5p6RB-u5kpF0ORmZD9luDzpXTMuvKUTA9_-0fiZ_P1wN0I9M9ETscih9gZBOMvGIK5rxsJn4JqOHmWt38fi58Q0Z13ORH-TciMRuqogh0ontqiAllbHKgmg5kFyWUr7lmHzyxxpygfzRnOVnJpmYlr_uf_lKj03mX8RFo7I-Dh_Rt0nIjF03qn2JHrB0zTS8R2PjkkmxDmS6MvlNn1zsNek60-PVYzYN2zskr-kr6XwDXY122VB-qhxnF_GF7IUa4SHlGVAcuDYCvANjiInaUkl-7sUctmXP0ZeLWSGcDV7XlccmUpRHZQleWwL7k9HJ00lTRL3OOrLEvyZn2C8nlf8qLcWsbapZRxU6SLHEzW4KrU35I3-7-7-w2QjnfCxsBPH4spcT8OKRjeKjumfBo6t4iCE-ymCQV5N-wAOxfxOwlED8Av1RM8Xc8Ls_plCcF22zQvFJH-4T5pt8iqIZjWXeap8UFKhbWqBhu3hw8CbnVFo4TKBEr08j9uhlH0H-D8x1DBvUyaY6WGQWmxdwFViCKozG7EPT9yxWdyrPKL2ihFcwUGuqW2GmaoYP8VUfuCIkGBBIHMYbDLvVeBbWplrCm3bM4k51MHzi0M_hNdKcdVyDfnCzGgBi-4XHziBTzi3QllTvum01RR60rRe58-nHFJa6DpvCb6V28xTimjX5y--jALGyfnZPqAu7sQM9VJczKWIfuHbGNlw2eziG7xBldkckFhCwuSSKxVvNO0YwQLFYoT1ZlJ8lERl2hngzdhpIa-de38S0szlLezwzXQsNPVAbJQh2TdFyUoCY9kADvCWBYrDJAbuJoOIJ7e7zL0zwKMqjwVY0QiTIVkjSi2r_QJlyP-4Gq8zNjjFw8TKgZA_o8LW0gdRpafBfTuVD7YMrAviDX6e0bSYZZSQ-kpbum-nUMqJc_yatpAaQ8FnwOASkfaxv4csJxrd6NDCOylvKRSc6P7Z4i3X-ohpK8SaX_IcwjLOnWe7ruZPuJtWR32LMIApQljjLOuXsEdXIO_GgfFcGDA4XdxpoC5naj5Vx_-t1oxcveZXuYjjJqNK4FHdDcvuXnjLmMBKbSqLvz54r-hX_T2iddN99sxplgy8L-Vu9glrkK_uCjtWXHg55F0ctayeF9VaWdawipWiiLEmhtSNnmAehvVAbQcsKt3OPXIZMMMuSpwLtuYzG4UxzxfxpFTnv05cm4HnHYX4XnZiFTpi3vDj4Lq_w0lXJvNWuY3v5YXfBDLh5CFmqNU3FbEQRY4sA7s0CbOBgL6TQ6JfBzsqDw6Kcli8ePOfluQs5X-2Dsa8lmajv-GnDJ_8we-rk74iFEELhQfqVuWMUnASnZiWJMomCIxku2wXOFcHSrIBP0IbmRTK9Iwd6yhVXuyeb-d5TdorsdAcBu-LHeXDuTKEYIKgFVGEtNEXIr3yV2G1Sg1A8Cva_itw5ccVItvCQuTl7kjMMtvy2abXsqY8lZqPRfFpa4m5Xh58uETTSkfoff-nMv1v_qah9JvjmxxrhAXSBoHigOuiEBu9s-KgfFO6PusJnAQmf81-N8nvL1xzdJZWjLpjv5JsbLIIwdPxjs4Vu9y1exOvkikYXY_Y_qsYJVEyuJRxsIdAVtwq37Cu6gbaDHxRBCvLqiLGvX2Rso8W2ZQMLuHRavA529RRWDi5xFdOKcsXB4tmtwbvdOvQkdRvYjKC6J8uiziLBh7NxQf3Tk90jHJg_N4yfxlg-ENaSaEsemwoFWCnjFSuKjgdHcedRybMYrovb608EX2ftoTm0gjNDvQPR3V4rzC-eCFDMq5xYj-IwuMrwFLhrC8KesX7ZhehlEegJsECPQw_jdHonOcE3AZWEYPn8qGZEcyRgDm7TY8owyIX2_j8HTaiQhuWsHwfhrSAfGxPd4kp8yjNqhduFGLzkCYpcEGb0IF4IKOFLInwyLoXRtWN2kZYKyr_exekDx6Vcedldhl51E9HelhdaThUT24wG4SKrso2q2NbM8HXjwgkC39lehqvGxBDjwVeGray1YNkJ-a4zbOBc8cJg88gBSszS2BsGIXsOGu6l13hYe6d4ELJIZqBcWHX0Jcgg1Xjas13VgkpuieAjTg2wJi4UiVSk4ZYemLk_cBgnZZc1UgTHcvb-232SR_3YaxuPjCsegvMoA6LL6bH2O7qQNNSEw-VmQ2l_cq904us0J01hX0b2bM7vfQjkG1BEN5w26YsMgvJChXOJ8TA_KCrYCeBkKWCUvNBSrYld9mnQThrvtoaSVR9tfRqU9qsdDijdwZjovbe3nFmYCE20ICxqBIrDx9ARUAVHzH-INxv0JrpiAv-I1JsLcNcPh6kd9W80IugMpZCUtPiwt-EpICVhDIxpSSd6X14w4zIuiF6NUv-0CZazailSRU78mV2plMfnGNnc1TFDchFmY89lh3eu7KbNnzIGhopKgdGS2QCMFpQvbWFHhEb-EC4TwJhorKIjKFYmyqj2rHmrRibiTJXJVeZtWrevYCQdK4Y1xblzmRQzvryZJlvdUkXxxQFYWpiX00zHmjETwX9m2EwHjCiD10PJyHsxdO5BMMUU3Sm8EFCczNOEeUoPOj4eYparp_uNqdvQiKd_gVh3F-w0LzTv8-eiAIBEIC0JQsycqcZH6sye0EgeyU4bcGjJI2eKVf6U50tF7uuKHUVnushlpL-dYVsV1QsCwVsHJfR0V8DRMOcYgfb88PZf7PF_aWg9620VDZSrbpu3KH1NO5QqSxC4mLkjbShDOJ0Eqh6625n8HHlJWhDszabTqJwBZo98pq9x9HehbFJbLiZLMKiDuuZvLHlbU-QMC9aaWzuQibXUz-0SEn7VEb7GB_q8q94-a0NWNh2mFKgvS8I0kE-Q_xG-kTA1ToF_ghfOWmiNWjKol4Umkj-QLdblDZDmUAWzsl4zkGY3OaFK4FNOptWL1SPutXNU2dgcxwrVFBYkHnRSUw4ACgx3sIHPqxZTVd4d5RdgPvxAnhXKz6wipjH8ha31x6zboss_VkYua_IrO-b5MZ3GauEDOSHxl_oezWUAoQt-4EtHYrDxsFVL8UlTtCSSOAE1Q_2EZKRLWXx2Eb9Ul_Ugz45vEXLAeoP3YFuOJiaDFBlcasSHiyaiCk8CJ344UlIu73Zv5wOeMQQwn4TSenE5Q5Q-UM92B4yX6p18xC6Jx80H5IKwldKUhXbMpTzHuO8O1lImYWzmdJvdwc7lve4p6bs3TgeSWS8HCM7ii9BDBfg-179Sh2bqIAG6-hYg_EyL7i_wOPBldXH4JHCbsZtwUesqHJHJPVVbOOBHfwB4AdZFeFPYj1KArcTJZe7UluGBQ4UhZvTVEeYH1UB4owUIN2t5InELSnwLiap6DGHOFOpicmVzrxBWho_dKc1mt_syeD_iH6NNngBFQxBA6rXuAIBTIGjDOtBxeRO3P8yW2mvZ9IbpJO25Afx8ACtbbIMOQgVAUVwxETzwWkmcYa6LriaLZfWyBYzh3Yn_zrHT7JMkephmpQzWLpWK9GinKWIuhigIHt-XUU1KdsTZfcW2S7MDdzb-TgXQ8mjSo9BO7-cewAGXtH3BL28gzCVEMWYOgm71wZbkbkSYvZRxENNvBH8d5gadxBeFf8aYdjWK2uACviML2W2VD4bdYTusTgGO5vgWUbEHDFcgPRTgUj9SUWDMXF9NqN-6hKpfsZyFLb8vx2Wc8kIk1ETwL_M8CZBvN1aZ6zuVo1Lo01ZLOO24QzkXKZXvVIuv9CBMT_2WORXyNbCYBcYAJ40-fErcs9xi2mZq3wZLhmsZvttMa-Yuh9eMHuftt_Ob6UgPOGfdHfpv9F2zRBoCbzrQJLZwwXNUZfL4xK0HGpC72jORVLX5kjKDNzldKqWORNXmWhH4bZMcObr6JAHPgn6IiMgi6igGY6Rq-IFAI2AtNfm2wpayXor-ZnvtqcKAN7Z7j2caMY6OnWOtYNykihz0Vx89idoe7tT23YUTet3JfUr0sbEBwC92enDqNHjQfmyZrkKS13Cv4iXYwQ-34OUt33204CtWiCtQDt9wTbFuTuZP8w6WM4eP27HNpYP5S2jAikk4tt9QGKhcuX28KdLKJRGXup5DrJignBHE3dtt7V4qx5zEUOIaa4RAODvzRYXDzA8oxqMD1hx27NWMWRRmrwJ1bH4xWtj4oRSYJuZkpPsHlJQ9DO9wpzJHk3BHci9-Obd4dosPcanxpvqQOPCbnxp_pwFfF9KPzKHeqykzwn2IyN7woiS6JZDwMLtT74aPaxZVlA9eFx7tMjRdEYjD1K-49phNQbhcatCDZ9-GoFzQoynbzVHrjTAmhu4j8KwmtDgCEHobNv5bbSYvaqWIQyLtil-kvy5awK3rZarYtybU3xbh5D4lqPd2qObHJRBC145MaOT8GxpAnCU9H39CK2D7I63c41-od5x8Yd20PgS4ORZawLNnNTiiBOFlTlG0SHfBQIHrrNfKpIqGdBHISoNcBx2FuCY7yaxJAltFgzc0u8s4-kZ3n20-WQ8-WUgnT8yblmG2iCFzaYAK6rcxZ8pFOHm_evBYr4SUCDxLE7P2wwKQDnzqhxOMnmLvbOEYBRugV1lPWxEUJ1I0dsNhbo1cCI6uhuvsa5tKrQ-mqc62kZs-MzYvIFI6hEi0JlFqIIIGu19T74Kcs4pLeodfKk_q7jVQ2u4u7RP2yCC5Vt-msHyJipd3frH221Hh18VD9LCXfCXp05Jvv9Fggf9ccYN1wNKcNTPHted6N0_7QfVBoHXvgt3asiGOfYuudOcOENYa0RNSRVTfnJMZsQv6plkKRMAWKOBD-e9vhZdkrpPYRyb4je0-2ZbzwxBWULOi7dRbbnGcXbELocrfHFg7D6ePwI8txT2JnCsKoNs4zhvGDULw2yUomf5Gsn901cohjhkVAfgWJ0NTKzZJlGeXPIARZjzv2mPlyaj44EGD3Et8j9XDuvtWJ6Iygq48IRgKqjTfCl3wiRM0hTPUfZst-UAbUMhs8Xtht4Ov8lVmVY1CnOq-MWq5DYUyW14nVg2wLUF4lP65bsXHRZIFwKh24g0C6VUJ18qI2-GL3jQ7nACZzLJwPjW3v4yPtvhS2CTXB6OrfxV-ENKqxRfiDc5H65D_mZBbbfDb5KERL-iZZb3z8zjgi6NuWGNs3HP9uHVBi9RoCEndGt7TfQiIkHzPvBH-qE-qowSIt39ZfSMfujDgNhIUGr41xD3a1BKlH8DTAhtoHC8dslC0w3riRYZhpoQfffipzSvBnj-klGpjfKhuW4WQP6hCIMw2fM2_Xi-mRld2g2G6IRpGznsT_rA5y8kQc47-k3Rx9JLBX3r7BgNsYHRA74lX-jURJk-k0UvjvwwnvFb9pOHQ-UcGOL69mX3-uaxByP6pwm9dprDXcY95VAx-EI-tCpn8piRXc51cNScYYqxRxq9EuOy3L6espohpkvrF-SsmQyEOMGspk4X_B_pYT20ThPwxis5FJRBQlgOnmHiiRGVNCLwES-1RMwMRHVA7e7RQNXKcX8eSVqDSbLPRPFebUfT18QpPoeyNE3HWo602t2eiiiD8mTXGpPE-lCvrGbC18l4cq8MqyYtcpmr7bTHZW4WGH338Kwyxj8kviRecKnM1JxdLvEGGyxToW4MWlxKR_2_QKQxTF_M8m6xxKYPjGtiiNV7wGT815NN3DxW_pv4IOnFUAnMnvYeShv9TPdnE27F8Q2Mgi2LEfvqqcIswT4kqmMq5S2xed9S4Xg9yTMkLok7hu9FWsTR9welW2Je6lXDRW_rBpYO_9iP-E6-Qdu7jX1O3lDATgnQ4Y_WQcIa3xBeQYGm5hMx5aDaUmLn-koSYzfyyOOqY3yWqpnm-FasliY2KnDuauCBvAAq1LlfKJ4ntBhSiXjsGadvERANfvoPlPAY7Fsqbv4s_Y2VD4aKkWeG4u90TOMts_52L_IGa8LVxbouF3bFWfz1Ao_dNO5V4ghp9Ki1FScIkh_1JWMiO2l2120H7GgkNMiZHTmCt5z-5u9Zz4AdD3UwmQ2_scQBvmNLfcBHXLhsRJf_rH-XhjL-o5P0NEbr3tpJwSomLn4Q4seZEf5hHwXjFapH_uD0rhGfwz7ypNK5wxVrDTTFj-00eTHirEm7o7TTXRtVmloBKmjVbHv-IW3YOr0VWcE77-uPqd7cOUSUYrmC4n4NjPvAiQ3He7gw6T7RJauUIsRH6MPa2P70JtP5RE4hADvBTlEIw7a0Vf7xPuryXEHmf0C6Qh78XExXUPpqwY6dOOjgIVYEly-tXOk-NTpwGEOuwLYd_2Loz4JOvuagHS9Q1g_YsjCJDU2HRDwH-so9sGkTPGoGBbYbVRjF5ksj7maJ-D-MD2IXiEqFTdydEpsXOAh0znVxSaBM8msT0YB8RgFOPfGeDEMO_ixFUm7ifnLE4j_YwwneGX-ojTY8Ld14a18YGXsxZVpUBQFgxF7YHBePBIA2NDLcpE5xVeCxOzjrwMfCTcTkzcSZ6L7NMCwgCjLPAcUDWYqlWjOZ53yAqDpUKgZI5gfAZ84HHNL3UcGjM8Z19Aho4KPPluuHH7Pj-BLKM_GxohEjPoX0nJOdyB4sbGcov7np1J_jMwnpYzt_xbGEVuTEG9C9Z1EDcUgPQjmtPhtL_49FTlo5p-_wPVKRAELmfRaQr0PcwkbsFO01H-N7hXX5zP2dSEkgA3aRZ72-JtFnuaKgdCGOlt8JuzHOKN5-cihBEvrkjiKN0ZEbFKscA18EFSRLVtr9I8JE_zxGGC7FpKTkD4Z9RWb_7A2nkFbht5HuD3HcBNnL1ECfCvQQgPnR_w2KhcceO2FkcmWlVmgtNqoS3zP51YHqpAxq8_hDwAS4MrfUFs_3136zmR9mZus6F6Qofp2EkZ7igcsj5KR_j8moRE7BVjDB_Qzp_dG5jX7rPsbDROSFgTwewgx1niXhZWNInR4QgGosUIWMF7HM1ixvU3UudE9Zvb6x3JWFlvTM5wXGe917YfAl68LOkdEuvT2keYKNUohjDxEx17tdBUOF0_VUYM44iIfPJpqhp2_a_naB8QcQEgBh-i4nFH_Ob09vT_5cwf5cb47kXcjvWmrvIs1Tf5HyE_4gh5sgxp4L_1bs-bQOunFU9FWuBhuUke6EJ9U6KA0gv03UsQ-Y0ael0bm4DlTEJ7vwu91Oh-0z6bKO80_m6ejv8FDwClpQEo5C4oESz2-lNdvoIBuoHQwZpEEWnQBEjcRbX-dd-B50UqmxaufZf4xh0I_u14fbR-aPGSpRGtrQNJrNx3YZZxAxSUMQ6CgyTQrBPqvZHlGGs-L8AYGEGPK1r285tpCcGxEv94r35S8O-YPXA_trCjdNxv8jhi6GU8UCsYxW2fFAtzE8LvpvTdfB6htUqC40M-5B8LOCJXyMLKWVfSn9tGnsfCNL8v-HOEgw3C_WtzF8tG--sw4HDlv14gd57fmn5rlm6bN2xjftJE-RcdOfcL9W6ieo_kkE3sl68Ol4mGt7kLi3pm-rnfcbLgfX40y_usOBht8-N77yb2WUPuZlDxuh3aWHxc8X2PR_y-xtLA2U_K2eqQ8LuGHb8nfxad_mwLz_NLVR_NMg6v4tT6KOI3VywYifHzMzT-xv3raw9_zvRI-TA"); let pr = []; while (true) { let m = r.RU(8); if (isNaN(m)) break; pr.push(m) } return new TextDecoder().decode(inflate(new Uint8Array(pr))).split(";") })()
let wordDictSmall = ["im", "we", "am", "it", "in", "my", "and", "the"] // Max Length: 8, entry length 2+
let wordDictTiny = ["i", " ", "a", "\n"] // Max Length: 4, entry length 1+

wordDict.forEach((w, i) => {
    if (w.length < 3) throw new Error("Dict, " + (i + 1))
})

let type1 = /[a-z\.\-\: \n]/gm
let type1swap = "\nabcdefghijklmnopqrstuvwxyz.-: ".split("")
function runTest(str) {
    let CompData = new BB()
    CompData.WU(5, 0)
    let results = { type1: { done: false }, type2: { done: false }, type3: { done: false }, type4: { done: false }, type5: { done: false } }
    if (str.replace(type1, "") == "") {
        let W = new BB()
        str.split("").forEach((char) => {
            W.WU(5, type1swap.indexOf(char))
        })
        results.type1.result = W.G()
        results.type1.done = true
    }
    if (true) {
        let W = new BB()
        let largest = 0
        let smallest = Infinity
        str.split("").forEach((char) => {
            if (char.charCodeAt(0) && char.charCodeAt(0) > largest) largest = char.charCodeAt(0)
            if (char.charCodeAt(0) && char.charCodeAt(0) < smallest) smallest = char.charCodeAt(0)
        })
        let size = largest - smallest
        if (size == 0) size++
        W.WU(8, size)
        W.WU(8, smallest)
        str.split("").forEach((char) => {
            W.WU(Math.ceil(Math.log2(size)) + 1, char.charCodeAt(0) - smallest + 1)
        })
        results.type2.result = W.G()
        results.type2.done = true
    }
    if (true) {
        let W = new BB()
        let drain = str
        while (true) {
            if (drain.length == 0) break
            let fnd = false
            wordDict.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 0)
                    W.WU(12, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            wordDictSmall.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 1)
                    W.WU(3, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            wordDictTiny.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 2)
                    W.WU(2, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            if (!fnd) {
                if (!drain.charCodeAt(0)) throw new Error("Unknown char")
                W.WU(2, 3)
                W.WU(8, drain.charCodeAt(0))
                drain = drain.substring(1)
            }
        }
        results.type3.result = W.G()
        results.type3.done = true
    }
    if (true) {
        results.type4.result = str
        results.type4.done = true
    }
    if (true) {
        let W = new BB()
        let drain = str
        let good = true
        while (true) {
            if (drain.length == 0) break
            let fnd = false
            wordDict.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 0)
                    W.WU(12, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            wordDictSmall.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 1)
                    W.WU(3, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            wordDictTiny.forEach((wrd, i) => {
                if (!fnd && drain.startsWith(wrd)) {
                    W.WU(2, 2)
                    W.WU(2, i)
                    drain = drain.replace(wrd, "")
                    fnd = true
                }
            })
            if (!fnd) {
                if (!drain.charCodeAt(0)) throw new Error("Unknown char")
                if (drain.charCodeAt(0) <= 64) good = false
                W.WU(2, 3)
                W.WU(6, drain.charCodeAt(0) - 64)
                drain = drain.substring(1)
            }
        }
        results.type5.result = W.G()
        results.type5.done = good
    }


    Object.keys(results).forEach((type) => {
        if (results[type] && results[type].done && results[type].result) {
            let MD = new BB()
            let LZC = ""
            let PKC = ""
            let temp = LZ.compress(results[type].result)
            if (LZ.decompress(temp) == results[type].result) { LZC = temp.replace("` ", "•") } else { throw new Error("Mismatch 1") }
            temp = deflate(results[type].result)
            if (new TextDecoder().decode(inflate(temp)) == results[type].result) {
                let W = new BB()
                temp.forEach((byte) => {
                    if (byte >= 2 ** 8) throw new Error("OOR")
                    W.WU(8, byte)
                })
                PKC = W.G()
            } else {  throw new Error("Mismatch 2") }

            // console.log("DATA", "\n1.", LZC, "\n2.", PKC, "\n3.", PZC, "\n4.", LKC)
            // if (LZC.length <= PKC.length && LZC.length <= PZC.length && LZC.length <= LKC.length && LZC.length < results[type].result.length) {
            //     MD.WU(5, 0)
            //     results[type].result = LZC
            // } else if (PKC.length <= LZC.length && PKC.length <= PZC.length && PKC.length <= LKC.length && PKC.length < results[type].result.length) {
            //     MD.WU(5, 1)
            //     results[type].result = PKC
            // } else if (PZC.length <= PKC.length && PZC.length <= PZC.length && PZC.length <= LKC.length && PZC.length < results[type].result.length) {
            //     MD.WU(5, 2)
            //     results[type].result = PZC
            // } else if (LKC.length <= PKC.length && LKC.length <= PZC.length && LKC.length <= LZC.length && LKC.length < results[type].result.length) {
            //     MD.WU(5, 3)
            //     results[type].result = LKC
            // } else {
            //     MD.WU(5, 31)
            // }
            // results[type].result = MD.G() + results[type].result
            if (LZC.length <= PKC.length && LZC.length < results[type].result.length) {
                results[type].result = LZC
                MD.WU(5, 1)
            } else if (PKC.length <= LZC.length && PKC.length < results[type].result.length) {
                results[type].result = PKC
                MD.WU(5, 2)
            } else {
                MD.WU(5, 31)
            }
            results[type].result = MD.G() + results[type].result
        }
    })
    let largest = null
    let size = Infinity
    Object.keys(results).forEach((type) => {
        if (results[type] && results[type].done && results[type].result) {
            if (results[type].result.length < size) { size = results[type].result.length; largest = type }
        }
    })
    if (largest) {
        let id = parseInt(largest.substring(4))
        if (id) {
            CompData.WU(5, id)
            return encodeSafe(CompData.G() + results[largest].result)
        } else { throw new Error("Cannot find type " + largest) }
    } else {
        return "UNCOMP" + encodeSafe(str)
    }
}
export function netcompress(str) {
    let out = runTest(str);return out
}
export function netdecompress(str) {
    if(str.startsWith("UNCOMP")) return decodeSafe(str.substring(6))
    str = decodeSafe(str)
    let meta = str.substring(0, 2)
    str = str.substring(2)
    let r = new BB()
    r.F(meta)
    let ver = r.RU(5)
    let id = r.RU(5)
    let out = ""
    let finals = str.substring(0, 1)
    str = str.substring(1)
    r = new BB()
    r.F(finals)
    let typ = r.RU(5)
    switch (typ) {
        case 1:
            str = LZ.decompress(str.replaceAll("•", "` "))
            break
        case 2:
            let sta = new BB()
            sta.F(str)
            let bk = []
            while(true) {let nr = sta.RU(8); if(isNaN(nr)){break}; bk.push(nr)}
            str = new TextDecoder().decode(inflate(new Uint8Array(bk)))
            break
    }
    let W = new BB()
    W.F(str)
    switch (id) {
        case 1:
            while (true) {
                let n = W.RU(5)
                if (!isNaN(n)) {
                    out += type1swap[n]
                } else break
            }
            break;
        case 2:
            let size = W.RU(8)
            let small = W.RU(8)
            while (true) {
                let n = W.RU(Math.ceil(Math.log2(size)) + 1)
                if (!isNaN(n) && n != 0) {
                    out += String.fromCharCode(n + small - 1)
                } else break
            }
            break;
        case 3:
        case 5:
            let go = true
            while (go) {
                let n = W.RU(2)
                if (isNaN(n)) break
                switch (n) {
                    case 0:
                        let ind = W.RU(12)
                        if (isNaN(ind)) break
                        out += wordDict[ind]
                        break;
                    case 1:
                        out += wordDictSmall[W.RU(3)]
                        break;
                    case 2:
                        out += wordDictTiny[W.RU(2)]
                        break;
                    case 3:
                        let chid = 0
                        if (id == 5) chid = W.RU(6) + 64
                        if (id == 3) chid = W.RU(8)
                        out += String.fromCharCode(chid)
                        break;
                }
            }
            break;
        case 4:
            out += str
            break;
    }
    return out
}