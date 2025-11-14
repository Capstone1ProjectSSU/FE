// // src/components/sheets/SheetList.tsx
// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
// import { motion, AnimatePresence } from "framer-motion";
// import Button from "../common/Button";
// import ModalPortal from "../common/ModalPortal";
// import Input from "../common/Input";

// import { useSheets } from "../../contexts/SheetContext";
// import type { SheetBase } from "../../types/sheet";

// interface SheetListProps {
//   onSelectSheet?: (sheet: SheetBase) => void;
//   sheetsOverride?: SheetBase[]; // 추가됨
// }

// export default function SheetList({ onSelectSheet }: SheetListProps) {
//   const { sheets, remove, edit } = useSheets();

//   const [openDropdown, setOpenDropdown] = useState<number | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<SheetBase | null>(null);
//   const [editSheet, setEditSheet] = useState<SheetBase | null>(null);

//   /** 저장된 악보가 없을 때 */
//   if (!sheets || sheets.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner"
//       >
//         <p>No sheets available 🎼</p>
//         <p className="text-sm mt-1 text-gray-500">
//           Try uploading a new audio!
//         </p>
//       </motion.div>
//     );
//   }

//   return (
//     <>
//       {/* Sheet 카드 목록 */}
//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {sheets.map((sheet, idx) => (
//           <motion.div
//             key={sheet.musicId}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: idx * 0.1 }}
//             className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
//           >
//             {/* 드롭다운 버튼 */}
//             <div className="absolute top-3 right-3">
//               <button
//                 onClick={() =>
//                   setOpenDropdown(
//                     openDropdown === sheet.musicId ? null : sheet.musicId
//                   )
//                 }
//                 className="text-gray-400 hover:text-white transition"
//               >
//                 <FontAwesomeIcon
//                   icon={faEllipsis}
//                   className="w-4 h-4 text-gray-400 hover:text-white transition rotate-90"
//                 />
//               </button>

//               {/* 드롭다운 메뉴 */}
//               <AnimatePresence>
//                 {openDropdown === sheet.musicId && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -5 }}
//                     transition={{ duration: 0.15 }}
//                     className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg text-sm text-gray-200 z-50 overflow-hidden w-32"
//                   >
//                     <button
//                       onClick={() => {
//                         setEditSheet(sheet);
//                         setOpenDropdown(null);
//                       }}
//                       className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
//                     >
//                       ✏️ Edit
//                     </button>

//                     <button
//                       onClick={() => {
//                         setConfirmDelete(sheet);
//                         setOpenDropdown(null);
//                       }}
//                       className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
//                     >
//                       🗑 Delete
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Sheet 정보 */}
//             <div>
//               <h3 className="font-semibold text-lg text-white flex justify-center mt-4">
//                 {sheet.title} - {sheet.artist}
//               </h3>
//               <p className="text-sm text-gray-400 mt-1">
//                 {sheet.instrument}
//               </p>
//               <p className="text-xs text-gray-500 mt-2">
//                 Difficulty: {sheet.difficulty}
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="flex items-center justify-between mt-6 mb-0">
//               <p className="text-xs text-gray-500">
//                 {sheet.createdAt?.split("T")[0] ?? ""}
//                 </p>

//               <Button
//                 onClick={() => onSelectSheet?.(sheet)}
//                 variant="primary"
//                 className="px-4 py-2 text-sm"
//               >
//                 Show
//               </Button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* 🗑 삭제 모달 */}
//       <AnimatePresence>
//         {confirmDelete && (
//           <ModalPortal>
//             <motion.div
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-center text-white shadow-lg"
//               >
//                 <p className="mb-4">
//                   정말{" "}
//                   <span className="text-red-400 font-semibold">
//                     {confirmDelete.title}
//                   </span>
//                   을(를) 삭제하시겠습니까?
//                 </p>

//                 <div className="flex justify-between mt-6">
//                   <Button
//                     onClick={() => setConfirmDelete(null)}
//                     variant="outline"
//                     className="w-[48%]"
//                   >
//                     취소
//                   </Button>

//                   <Button
//                     onClick={async () => {
//                       await remove(confirmDelete.musicId);
//                       setConfirmDelete(null);
//                     }}
//                     variant="primary"
//                     className="w-[48%] bg-red-600 hover:bg-red-500"
//                   >
//                     삭제
//                   </Button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </ModalPortal>
//         )}
//       </AnimatePresence>

//       {/* ✏ 수정 모달 */}
//       <AnimatePresence>
//         {editSheet && (
//           <ModalPortal>
//             <motion.div
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
//               >
//                 <h3 className="text-xl font-semibold mb-4 text-center">
//                   악보 정보 수정
//                 </h3>

//                 <div className="space-y-4 text-left">
//                   <Input
//                     label="곡 제목"
//                     name="title"
//                     value={editSheet.title}
//                     onChange={(e) =>
//                       setEditSheet({ ...editSheet, title: e.target.value })
//                     }
//                   />

//                   <Input
//                     label="아티스트명"
//                     name="artist"
//                     value={editSheet.artist || ""}
//                     onChange={(e) =>
//                       setEditSheet({ ...editSheet, artist: e.target.value })
//                     }
//                   />

//                   {/* 난이도 */}
//                   <div>
//                     <label className="text-sm font-medium text-gray-300 mb-2">
//                       난이도
//                     </label>
//                     <select
//                       value={editSheet.difficulty}
//                       onChange={(e) =>
//                         setEditSheet({
//                           ...editSheet,
//                           difficulty: e.target.value as any,
//                         })
//                       }
//                       className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200"
//                     >
//                       <option value="EASY">EASY</option>
//                       <option value="NORMAL">NORMAL</option>
//                       <option value="HARD">HARD</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* 하단 버튼 */}
//                 <div className="flex justify-between mt-6">
//                   <Button
//                     onClick={() => setEditSheet(null)}
//                     variant="outline"
//                     className="w-[48%]"
//                   >
//                     취소
//                   </Button>

//                   <Button
//                     onClick={async () => {
//                       await edit({
//                         musicId: editSheet.musicId,
//                         title: editSheet.title,
//                         difficulty: editSheet.difficulty,
//                         artist: editSheet.artist,
//                       });
//                       setEditSheet(null);
//                     }}
//                     variant="primary"
//                     className="w-[48%]"
//                   >
//                     저장
//                   </Button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </ModalPortal>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// src/components/sheets/SheetList.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import ModalPortal from "../common/ModalPortal";
import Input from "../common/Input";

import { useSheets } from "../../contexts/SheetContext";
import type { SheetBase } from "../../types/sheet";

interface SheetListProps {
  onSelectSheet?: (sheet: SheetBase) => void;
  sheetsOverride?: SheetBase[]; // 🔥 필터링된 시트 전달
}

export default function SheetList({ sheetsOverride, onSelectSheet }: SheetListProps) {
  const { sheets: contextSheets, remove, edit } = useSheets();

  /** 🔥 필터링된 시트(sheetsOverride)가 있으면 그걸 사용 */
  const sheets = sheetsOverride ?? contextSheets;

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SheetBase | null>(null);
  const [editSheet, setEditSheet] = useState<SheetBase | null>(null);

  /** 저장된 악보가 없을 때 */
  if (!sheets || sheets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner"
      >
        <p>No sheets available 🎼</p>
        <p className="text-sm mt-1 text-gray-500">
          Try uploading a new audio!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Sheet 카드 목록 */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet, idx) => (
          <motion.div
            key={sheet.musicId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
          >
            {/* 드롭다운 버튼 */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === sheet.musicId ? null : sheet.musicId
                  )
                }
                className="text-gray-400 hover:text-white transition"
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="w-4 h-4 text-gray-400 hover:text-white transition rotate-90"
                />
              </button>

              {/* 드롭다운 메뉴 */}
              <AnimatePresence>
                {openDropdown === sheet.musicId && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg text-sm text-gray-200 z-50 overflow-hidden w-32"
                  >
                    <button
                      onClick={() => {
                        setEditSheet(sheet);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => {
                        setConfirmDelete(sheet);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                    >
                      🗑 Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sheet 정보 */}
            <div>
              <h3 className="font-semibold text-lg text-white flex justify-center mt-4">
                {sheet.title} - {sheet.artist}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {sheet.instrument}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Difficulty: {sheet.difficulty}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 mb-0">
              <p className="text-xs text-gray-500">
                {sheet.createdAt?.split("T")[0] ?? ""}
              </p>

              <Button
                onClick={() => onSelectSheet?.(sheet)}
                variant="primary"
                className="px-4 py-2 text-sm"
              >
                Show
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🗑 삭제 모달 */}
      <AnimatePresence>
        {confirmDelete && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-center text-white shadow-lg"
              >
                <p className="mb-4">
                  정말{" "}
                  <span className="text-red-400 font-semibold">
                    {confirmDelete.title}
                  </span>
                  을(를) 삭제하시겠습니까?
                </p>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setConfirmDelete(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>

                  <Button
                    onClick={async () => {
                      await remove(confirmDelete.musicId);
                      setConfirmDelete(null);
                    }}
                    variant="primary"
                    className="w-[48%] bg-red-600 hover:bg-red-500"
                  >
                    삭제
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ✏ 수정 모달 */}
      <AnimatePresence>
        {editSheet && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">
                  악보 정보 수정
                </h3>

                <div className="space-y-4 text-left">
                  <Input
                    label="곡 제목"
                    name="title"
                    value={editSheet.title}
                    onChange={(e) =>
                      setEditSheet({ ...editSheet, title: e.target.value })
                    }
                  />

                  <Input
                    label="아티스트명"
                    name="artist"
                    value={editSheet.artist || ""}
                    onChange={(e) =>
                      setEditSheet({ ...editSheet, artist: e.target.value })
                    }
                  />

                  {/* 난이도 */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2">
                      난이도
                    </label>
                    <select
                      value={editSheet.difficulty}
                      onChange={(e) =>
                        setEditSheet({
                          ...editSheet,
                          difficulty: e.target.value as any,
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200"
                    >
                      <option value="EASY">EASY</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setEditSheet(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>

                  <Button
                    onClick={async () => {
                      await edit({
                        musicId: editSheet.musicId,
                        title: editSheet.title,
                        difficulty: editSheet.difficulty,
                        artist: editSheet.artist,
                      });
                      setEditSheet(null);
                    }}
                    variant="primary"
                    className="w-[48%]"
                  >
                    저장
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
}
